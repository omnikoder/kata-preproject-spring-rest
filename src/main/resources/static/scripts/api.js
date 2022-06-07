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

    async updateUser(id, body) {
        return await fetch(this.url + '/users/' + id, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: body
        });
    }

    async deleteUser(id) {
        return await fetch(this.url + '/users/' + id, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        });
    }
}