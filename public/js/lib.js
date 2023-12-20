const requestNewTokens = (state, apiStatusElm) => {
	fetch('/api/authenticate', {
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
		callAPI(state, apiStatusElm);
	}).catch(function(error) {
		console.error(` Error: ${error}`);
		apiStatusElm.innerHTML = 'You can not access API without access token. To fetch new token you must first login.';
	});
}

export const formHandler = (e, state) => {
	e.preventDefault();
	const data = new FormData(e.target);

	fetch(e.target.action, {
		method: e.target.getAttribute('method'),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(Object.fromEntries(data))
	})
	.then((response) => response.json())
	.then((json) => {
		console.log(json.accessToken);
		state.accessToken = json.accessToken;
		alert('This page now has access and refresh tokens! You can now access the API endpoint from this page even after reloading the page without need to login again.')
		e.target.reset();
	}).catch(function(error) {
		console.error(` Error: ${error}`);
	});
};

export const callAPI = (state, apiStatusElm) => {
	console.log(state.accessToken);

	if (!state.accessToken) {
		requestNewTokens(state, apiStatusElm);
		return;
	}

	fetch(state.endpoint, {
		method: 'GET',
		mode: "cors",
		headers: {
		'Authorization': 'Bearer ' +  state.accessToken,
		'Content-Type': 'application/json'
		}
	})
	.then((response) => response.json())
	.then((json) => {
		if (json.error) {
			apiStatusElm.innerHTML = `Error due to not having access token or using token that is expired. Fetching new tokens...`;
			requestNewTokens(state, apiStatusElm)
		} else {
			apiStatusElm.innerHTML = `${JSON.stringify(json)}`;
		}
	}).catch(function(err) {
		console.error(` Err: ${err}`);
	});
};
