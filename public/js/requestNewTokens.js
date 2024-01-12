import callApi from './callApi.js';

export default (state, apiStatusElm) => {
	fetch('/api/fetchTokens', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	.then((response) => response.json())
	.then((json) => {
		console.log(json.accessToken);
		state.accessToken = json.accessToken;
		callApi(state);
	}).catch(function(error) {
		console.error(` Error: ${error}`);
		apiStatusElm.innerHTML = 'You can not access API without access token. To fetch new token you must first login.';
	});
}
