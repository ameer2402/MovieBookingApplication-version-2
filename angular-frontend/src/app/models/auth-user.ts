export interface AuthUser {
    userId: number;
    username: string; // Changed from userName to be consistent
    jwtToken: string;
    role: string; // 'ADMIN' or 'USER'
    name: string; // Display name, could be same as username initially
}