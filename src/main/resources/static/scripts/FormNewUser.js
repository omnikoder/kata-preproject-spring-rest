import User from './User.js';

export default class FormNewUser {

    constructor(selector) {
        this.form          = document.querySelector(selector);
        this.inputName     = this.form.querySelector('input[name="name"]');
        this.inputAge      = this.form.querySelector('input[name="age"]');
        this.inputEmail    = this.form.querySelector('input[name="email"]');
        this.inputPassword = this.form.querySelector('input[name="password"]');
        this.inputRole     = this.form.querySelector('select[name="role"]');
        this.inputEnabled  = this.form.querySelector('input[name="enabled"]');

        this.alert = this.form.querySelector('#alertNewUser');
    }

    showAlert(message, type) {
        this.alert.querySelector('[data-bs-dismiss="alert"]')?.click();

        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        this.alert.append(wrapper);
    }

    init(getUsers, sendRequest, renderUserTable) {
        this.form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const response = await sendRequest(new User(
                null,
                this.inputName.value,
                this.inputAge.value,
                this.inputEmail.value,
                this.inputPassword.value,
                this.inputRole.value === '' ? null : this.inputRole.value,
                this.inputEnabled.checked
            ));

            if (response.ok) {
                this.showAlert('Новый пользователь добавлен!', 'success');
                this.form.reset();
                renderUserTable(await getUsers());
            }
            else {
                const error = await response.json();
                this.showAlert(error.message, 'danger')
            }
        })
    }
}