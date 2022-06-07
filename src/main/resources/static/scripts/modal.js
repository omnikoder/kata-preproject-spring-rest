export default class Modal {

    constructor(selector) {
        this.modal         = document.querySelector(selector);
        this.inputId       = this.modal.querySelector('input[name="id"]');
        this.inputName     = this.modal.querySelector('input[name="name"]');
        this.inputAge      = this.modal.querySelector('input[name="age"]');
        this.inputEmail    = this.modal.querySelector('input[name="email"]');
        this.inputPassword = this.modal.querySelector('input[name="password"]');
        this.inputRole     = this.modal.querySelector('select[name="role"]');
        this.inputEnabled  = this.modal.querySelector('input[name="enabled"]');
        this.buttonHide    = this.modal.querySelector('button[data-bs-dismiss]');;
    }

    init(getUsers, sendRequest, renderUserTable) {
        this.modal.addEventListener('submit', async (event) => {
            event.preventDefault()

            const response = await sendRequest(this.inputId.value, JSON.stringify({
                name: this.inputName.value,
                age: this.inputAge.value,
                email: this.inputEmail.value,
                password: this.inputPassword.value,
                role: this.inputRole.value,
                enabled: this.inputEnabled.checked
            }));

            if (response.ok) {
                this.buttonHide.click();
                renderUserTable(await getUsers());
            }
        });

        this.modal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const user = JSON.parse(button.getAttribute('data-bs-user'));
            this.inputId.value = user.id;
            this.inputName.value = user.name;
            this.inputAge.value = user.age;
            this.inputEmail.value = user.email;
            this.inputPassword.value = '';
            this.inputRole.childNodes.forEach(option => {
                if (option.nodeType !== 1) {
                    return;
                }
                option.removeAttribute('selected');
                if (option.value === user.role) {
                    option.setAttribute('selected', '');
                }
            });
            this.inputEnabled.checked = user.enabled;
        });
    }
}