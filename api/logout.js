import dotenv from 'dotenv';

dotenv.config();

export default async (req, res) => {
	console.log(req.cookies.refreshtoken);

	res.setHeader('Set-Cookie', ['refreshtoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT HttpOnly; Path=/']);

	res.status(200).json({
		message: 'Refresh token cookie is removed!'
	});
}
