import { SignJWT } from 'jose';

function setCookie(res, refreshToken) {
	if (res.cookie) {
		setCookieExpressServer(res, refreshToken);
	} else {
		setCookieServerless(res, refreshToken);
	}
}

function setCookieExpressServer(res, refreshToken) {
  // use secure on production so cookie is sent only over https
  const secure = process.env.development ? false : true;

  // set cookie to expire in 1 week
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // set access token in a httpOnly cookie
  res.cookie('refreshtoken', refreshToken, {
	secure: secure,
	httpOnly: true,
	expires: expires
  });;
}

function setCookieServerless(res, refreshToken) {
  // use secure on production so cookie is sent only over https
  const secure = process.env.development ? '' : '; Secure';

  // setting token in a httpOnly cookie, we need to specify Path since we
  // want browser to send cookie when page outside /api folder is requested
  // as we also use the cookie to allow access to public/admin.html
  res.setHeader('Set-Cookie', [`refreshtoken=${refreshToken}; HttpOnly; Path=/${secure}`]);
}

export async function setTokens(req, res) {
	// create jwt tokens
	const secret = new TextEncoder().encode(process.env.secret);

	const accessToken = await new SignJWT({ 'username': req.body.username })
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime('30s')
		.sign(secret);

	const refreshToken = await new SignJWT({ 'username': req.body.username })
	.setProtectedHeader({ alg: 'HS256' })
	.setExpirationTime('1w')
	.sign(secret);


	// send refresh token in cookie and access token in body of response
	setCookie(res, refreshToken);
	res.json({accessToken});
};




