export default class Api {

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

    async createUser(user) {
        return await fetch(this.url + '/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    }

    async updateUser(id, user) {
        return await fetch(this.url + '/users/' + id, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    }

    async deleteUser(id) {
        const response = await fetch(this.url + '/users/' + id, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        });

        if (response.redirected) {
            window.location.href = response.url;
        }

        return response;
    }
}