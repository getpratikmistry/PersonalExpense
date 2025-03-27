export interface UserDetails {
    UserId: number,
    Username: string,
    Password: string,
    Firstname: string,
    Lastname: string,
    Email: string
}

export interface LoginRequest {
    Username: string,
    Password: string,
}

export interface LoginResponse {
    id?: number,
    firstname?: string,
    lastname?: string,
    email?: string,
}