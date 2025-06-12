export class User {
    userId?: number;
    email: string;
    password: string;
    username: string;
    // mobileNumber field removed
    // userRole field removed (role is determined by registration endpoint)

    constructor(
        email: string,
        password: string,
        username: string
        // mobileNumber: string, // Removed
        // userRole: 'USER' | 'ADMIN' // Removed
    ) {
        this.email = email;
        this.password = password;
        this.username = username;
    }
}