import API from './api.js';

let api = new API('http://localhost:8080/api')

function createTable(userList) {
    if (userList == null) {
        return;
    }

    let body = document.querySelector('#user-table-body');

    userList.forEach(user => {
        let row = body.querySelector('#user-table-row-template').content.cloneNode(true);
        let rowHeader = row.querySelector('th');
        let columns = row.querySelectorAll('td');
        rowHeader.textContent = user.id;
        columns[0].textContent = user.email;
        columns[1].textContent = user.name;
        columns[2].textContent = user.age;
        columns[3].textContent = user.role;
        columns[4].textContent = user.enabled ? 'Активен' : 'Забанен';
        row.querySelector('#user-table-btn-edit')
            .setAttribute('data-bs-target', '#updatedUserModal' + user.id);
        row.querySelector('#user-table-btn-delete')
            .setAttribute('data-bs-target', '#deletingUserModal' + user.id);

        body.appendChild(row);
    });
}

window.onload = async () => {
    createTable(await api.getUsers());
};