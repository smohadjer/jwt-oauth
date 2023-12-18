import {SignJWT} from 'jose';
import dotenv from 'dotenv';

dotenv.config();

const allowCors = fn => async (req, res) => {
	res.setHeader('Access-Control-Allow-Credentials', true)
	res.setHeader('Access-Control-Allow-Origin', '*')
	// another common pattern
	// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
	res.setHeader(
	  'Access-Control-Allow-Headers',
	  'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	)
	if (req.method === 'OPTIONS') {
	  res.status(200).end()
	  return
	}
	return await fn(req, res)
  }

const handler = async (req, res) => {
	const {username, password} = req.body;
	console.log(req.body);

	if (username === process.env.username && password === process.env.password) {
		// create jwt tokens
		const secret = new TextEncoder().encode(process.env.secret);
		const accessToken = await new SignJWT({ 'username': username })
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('30s')
			.sign(secret);
		const refreshToken = await new SignJWT({ 'username': username })
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime('4w')
		.sign(secret);

		// we send accessToken as JSON in body of response as it needs to be
		// used in requests to service server, but refreshToken is sent in
		// cookie since it only needs to be used with authorization server

		// setting refreshToken in a httpOnly cookie
		if (res.cookie) {
			setCookieExpressServer(res, refreshToken);
		} else {
			setCookieServerless(res, refreshToken);
		}

		// setting accessToken in response body
		res.json({accessToken});
	} else {
		res.status(401).end();
	}
}

module.exports = allowCors(handler)

function setCookieExpressServer(res, token) {
  // use secure on production so cookie is sent only over https
  const secure = process.env.development ? false : true;

  // set access token in a httpOnly cookie
  res.cookie('jwt', token, {
	secure: secure,
	httpOnly: true,
	expires: new Date(Date.now() + 60 * 60 * 1000) // expires in 1 hour
  });;
}

function setCookieServerless(res, token) {
  // use secure on production so cookie is sent only over https
  const secure = process.env.development ? '' : '; Secure';

  // setting token in a httpOnly cookie, we need to specify Path since we
  // want browser to send cookie when page outside /api folder is requested
  // as we also use the cookie to allow access to public/admin.html
  res.setHeader('Set-Cookie', [`jwt=${token}; HttpOnly; Path=/${secure}`]);
}

