import { setTokens } from './_lib.js';
import dotenv from 'dotenv';

dotenv.config();

export default async (req, res) => {
	const {username, password} = req.body;

	if (username === process.env.username &&
		password === process.env.password) {
		setTokens(req, res);
	} else {
		res.status(401).json({'error': 'Invalid credentials'});
	}
};
