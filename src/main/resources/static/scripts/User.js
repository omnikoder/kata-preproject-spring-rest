export default class User {

    constructor(id, name, age, email, password, role, enabled) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.email = email;
        this.password = password;
        this.role = role;
        this.enabled = enabled;
    }
}