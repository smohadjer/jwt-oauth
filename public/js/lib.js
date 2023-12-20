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
	}).catch(function(error) {
		console.error(` Error: ${error}`);
	});
};

export const callAPI = (state, apiStatusElm) => {
	console.log(state.accessToken);

	if (!state.accessToken) {
		requestNewTokens(state, apiStatusElm);
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
			apiStatusElm.innerHTML = `<p style="color:red">${json.error}</p>`;
			requestNewTokens(state, apiStatusElm)
		} else {
			apiStatusElm.innerHTML = `<p>${JSON.stringify(json)}</p>`;
		}
	}).catch(function(err) {
		console.error(` Err: ${err}`);
	});
};
