import User from './User.js';

export default class FormNewUser {

    constructor(selector, invalidFieldClass) {
        this.invalidFieldClass = invalidFieldClass;

        this.form = document.querySelector(selector);

        this.fields = {
            name:     this.form.querySelector('input[name="name"]'),
            age:      this.form.querySelector('input[name="age"]'),
            email:    this.form.querySelector('input[name="email"]'),
            password: this.form.querySelector('input[name="password"]'),
            role:     this.form.querySelector('select[name="role"]'),
            enabled:  this.form.querySelector('input[name="enabled"]')
        };

        this.feedbackFields = {
            name:     this.fields.name.nextElementSibling.nextElementSibling,
            age:      this.fields.age.nextElementSibling.nextElementSibling,
            email:    this.fields.email.nextElementSibling.nextElementSibling,
            password: this.fields.password.nextElementSibling.nextElementSibling,
            role:     this.fields.role.nextElementSibling.nextElementSibling,
            enabled:  this.fields.enabled.nextElementSibling.nextElementSibling
        };

        this.alert = this.form.querySelector('#alertNewUser');
    }

    showAlert(message, type) {
        this.alert.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');
    }

    closeAlert() {
        this.alert.querySelector('[data-bs-dismiss="alert"]')?.click();
    }

    clearInvalidStatus() {
        Object.getOwnPropertyNames(this.fields).forEach(fieldName => {
            this.fields[fieldName].classList.remove(this.invalidFieldClass);
        });
    }

    init(getUsers, sendRequest, renderUserTable) {
        this.form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const response = await sendRequest(new User(
                null,
                this.fields.name.value,
                this.fields.age.value,
                this.fields.email.value,
                this.fields.password.value,
                this.fields.role.value || null,
                this.fields.enabled.checked
            ));

            if (response.ok) {
                this.showAlert('Новый пользователь добавлен!', 'success');
                this.clearInvalidStatus();
                this.form.reset();
                renderUserTable(await getUsers());
            }
            else {
                const error = await response.json();
                this.showAlert(error.message, 'danger');
                if (error.fields) {
                    Object.getOwnPropertyNames(this.fields).forEach(fieldName => {
                        this.fields[fieldName].classList[error.fields[fieldName] ? 'add' : 'remove'](this.invalidFieldClass);
                        this.feedbackFields[fieldName].textContent = error.fields[fieldName];
                    });
                }
            }
        })
    }
}