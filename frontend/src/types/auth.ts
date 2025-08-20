export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
}

export interface SignInCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials extends SignInCredentials {
    name: string;
}

export interface AuthResponse {
    user: User
    token: string;
}

export interface LoginResponse extends AuthResponse { }
export interface SignUpResponse extends AuthResponse { }
export interface RefreshResponse extends AuthResponse { }
