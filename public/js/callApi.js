export default async (state) => {
	/* since we are adding custom headers in this request, browsers will send
	a preflight request to the server and we need to make sure the server that
	responds sets Access-Control-Allow-Headers: '*' in response otherwise preflight
	will fail and no request will be sent to endpoint. */
	// https://stackoverflow.com/questions/41253228/preflight-or-cors-error-on-every-request
	try {
		const response = await fetch(state.endpoint, {
			method: 'GET',
			//mode: "cors",
			headers: {
			'Authorization': 'Bearer ' +  state.accessToken,
			'Content-Type': 'application/json'
			}
		});
		const json = await response.json();
		return json;
	} catch (error) {
		console.error(error);
	}
}
