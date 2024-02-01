import login from './login.js';
import logout from './logout.js';
import callApi from './callApi.js';
import getTokens from './getTokens.js';

const consoleElm = document.querySelector('#console');
const loginForm = document.querySelector('#login');
const logoutButton = document.querySelector('#logout');
const apiButton = document.querySelector('#api');
const state = {
	endpoint: 'https://api-jwt.vercel.app/api',
	accessToken: undefined
};

loginForm.addEventListener('submit', async (e) => {
	try {
		const json = await login(e);
		if (json.error) {
			consoleElm.innerHTML = json.error
		} else {
			state.accessToken = json.accessToken;
			consoleElm.innerHTML = 'This page now has access and refresh tokens! You can now access the API endpoint even after a page refresh.';
		}
		e.target.reset();
	} catch (error) {
		console.error(error);
		e.target.reset();
	}
});

logoutButton.addEventListener('click', (e) => {
	logout(state, consoleElm);
});

apiButton.addEventListener('click', async (e) => {
	if (!state.accessToken) {
		state.accessToken = await getTokens(consoleElm);
	}

	if (state.accessToken) {
		api();
	}
});

async function api() {
	const json = await callApi(state);

	if (json.error) {
		consoleElm.innerHTML = json.error;
		state.accessToken = await getTokens(consoleElm);
		api();
	} else {
		consoleElm.innerHTML = JSON.stringify(json);
	}
}


