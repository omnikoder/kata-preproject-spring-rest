export default class API {

    constructor(url) {
        this.url = url;
    }

    async getUsers() {
        let response = await fetch(this.url + '/users', {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });

        return response.ok ? await response.json() : null;
    }
}