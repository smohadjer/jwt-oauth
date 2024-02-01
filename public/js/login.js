export default async (e) => {
	e.preventDefault();
	const data = new FormData(e.target);
	const response = await fetch(e.target.action, {
		method: e.target.getAttribute('method'),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(Object.fromEntries(data))
	});
	const json = await response.json();
	return json;
}
