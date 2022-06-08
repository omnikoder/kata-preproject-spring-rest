import User from './User.js';

export default class Modal {

    constructor(selector, invalidFieldClass, successMessage) {
        this.invalidFieldClass = invalidFieldClass;
        this.successMessage = successMessage;

        this.modal = document.querySelector(selector);

        this.fields = {
            id:       this.modal.querySelector('input[name="id"]'),
            name:     this.modal.querySelector('input[name="name"]'),
            age:      this.modal.querySelector('input[name="age"]'),
            email:    this.modal.querySelector('input[name="email"]'),
            password: this.modal.querySelector('input[name="password"]'),
            role:     this.modal.querySelector('select[name="role"]'),
            enabled:  this.modal.querySelector('input[name="enabled"]')
        };

        this.feedbackFields = {
            id:       this.fields.id.nextElementSibling.nextElementSibling,
            name:     this.fields.name.nextElementSibling.nextElementSibling,
            age:      this.fields.age.nextElementSibling.nextElementSibling,
            email:    this.fields.email.nextElementSibling.nextElementSibling,
            password: this.fields.password.nextElementSibling.nextElementSibling,
            role:     this.fields.role.nextElementSibling.nextElementSibling,
            enabled:  this.fields.enabled.nextElementSibling.nextElementSibling
        };

        this.buttonHide = this.modal.querySelector('button[data-bs-dismiss]');

        this.alert = this.modal.querySelector('.modal-alert');
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
        this.modal.addEventListener('submit', async (event) => {
            event.preventDefault()

            const response = await sendRequest(this.fields.id.value, new User(
                this.fields.id.value,
                this.fields.name.value,
                this.fields.age.value,
                this.fields.email.value,
                this.fields.password.value,
                this.fields.role.value || null,
                this.fields.enabled.checked
            ));

            if (response.ok) {
                this.showAlert(this.successMessage, 'success');
                this.clearInvalidStatus();
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
        });

        this.modal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const user = JSON.parse(button.getAttribute('data-bs-user'));
            this.fields.id.value = user.id;
            this.fields.name.value = user.name;
            this.fields.age.value = user.age;
            this.fields.email.value = user.email;
            this.fields.password.value = '';
            this.fields.role.childNodes.forEach(option => {
                if (option.nodeType !== 1) {
                    return;
                }
                option.removeAttribute('selected');
                if (option.value === user.role) {
                    option.setAttribute('selected', '');
                }
            });
            this.fields.enabled.checked = user.enabled;
        });

        this.modal.addEventListener('hidden.bs.modal', () => {
            this.closeAlert();
            this.clearInvalidStatus();
        });
    }
}