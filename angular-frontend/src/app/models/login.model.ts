export class Login {
    username: string; // Changed from email
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}