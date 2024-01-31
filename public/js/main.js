import login from './login.js';
import logout from './logout.js';
import callApi from './callApi.js';
import getTokens from './getTokens.js';

const apiStatusElm = document.getElementById('api-status');
const loginForm = document.querySelector('#login');
const logoutButton = document.getElementById('logout');
const apiButton = document.getElementById('api');
const state = {
	endpoint: 'https://api-jwt.vercel.app/api',
	accessToken: undefined
};

loginForm.addEventListener('submit', (e) => {
	login(e, state);
});

logoutButton.addEventListener('click', (e) => {
	logout(e, state);
});

apiButton.addEventListener('click', async (e) => {
	if (!state.accessToken) {
		state.accessToken = await getTokens(apiStatusElm);
	}

	if (state.accessToken) {
		api();
	}
});

async function api() {
	const json = await callApi(state);

	if (json.error) {
		apiStatusElm.innerHTML = json.error;
		state.accessToken = await getTokens(apiStatusElm);
		api();
	} else {
		apiStatusElm.innerHTML = JSON.stringify(json);
	}
}


