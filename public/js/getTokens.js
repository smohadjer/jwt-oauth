export default async (apiStatusElm) => {
	try {
		const response = await fetch('/api/fetchTokens', {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});
		const json = await response.json();
		return json.accessToken;
	} catch(error) {
		console.error(` Error: ${error}`);
		apiStatusElm.innerHTML = 'You can not access API without access token. To fetch new token you must first login.';
	}
}

