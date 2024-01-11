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

export const deleteRefreshTokenCookie = () => {
	/* no-cache directive is necessary otherwise cookie may not be deleted if
	request returns a 304 status as it happens with Vercel server */
	fetch('/api/logout', {
		method: 'GET',
		headers: {
			'Cache-Control': 'no-cache'
		}
	})
	.then(response => response.json())
	.then(json => console.log(json.message));
}

export const loginHandler = (e, state) => {
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
	console.log('accessToken:', state.accessToken);

	if (!state.accessToken) {
		requestNewTokens(state, apiStatusElm);
		return;
	}

	/* since we are adding custom headers in this request, browsers will send
	a preflight request to the server and we need to make sure the server that
	responds sets Access-Control-Allow-Headers: '*' in response otherwise preflight
	will fail and no request will be sent to endpoint. */
	// https://stackoverflow.com/questions/41253228/preflight-or-cors-error-on-every-request
	fetch(state.endpoint, {
		method: 'GET',
		//mode: "cors",
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
