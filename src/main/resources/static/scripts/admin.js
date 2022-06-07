import API from './api.js';
import Modal from "./modal.js";

let api = new API('http://localhost:8080/api');
let modalEdit = new Modal('#modal-edit');
let modalDelete = new Modal('#modal-delete');

function renderUserTable(userList) {
    let body = document.querySelector('#user-table-body');
    body.innerHTML = '';

    if (userList == null) {
        return;
    }

    userList.forEach(user => {
        let userJson = JSON.stringify(user);
        let row = document.querySelector('#user-table-row-template').content.cloneNode(true);
        let rowHeader = row.querySelector('th');
        let columns = row.querySelectorAll('td');
        rowHeader.textContent = user.id;
        columns[0].textContent = user.email;
        columns[1].textContent = user.name;
        columns[2].textContent = user.age;
        columns[3].textContent = user.role;
        columns[4].textContent = user.enabled ? 'Активен' : 'Забанен';
        row.querySelector('#user-table-btn-edit').setAttribute('data-bs-user', userJson);
        row.querySelector('#user-table-btn-delete').setAttribute('data-bs-user', userJson);

        body.appendChild(row);
    });
}

window.onload = async () => {
    renderUserTable(await api.getUsers());
    modalEdit.init(api.getUsers.bind(api), api.updateUser.bind(api), renderUserTable);
    modalDelete.init(api.getUsers.bind(api), api.deleteUser.bind(api), renderUserTable);
};