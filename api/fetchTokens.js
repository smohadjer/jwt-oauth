import { setTokens } from './_lib.js';
import { jwtVerify } from 'jose';
import dotenv from 'dotenv';

dotenv.config();

const isRefreshTokenValid = async (req) => {
	if (req.cookies?.refreshtoken) {
		const refreshToken = req.cookies.refreshtoken;
		const secret = new TextEncoder().encode(process.env.secret);
		try {
			const payload = await jwtVerify(refreshToken, secret);
			return true;
		} catch(err) {
			return false;
		}
	} else {
		return false;
	}
}

export default async (req, res) => {
	if (await isRefreshTokenValid(req)) {
		setTokens(req, res);
	} else {
		res.status(401).end();
	}
}
