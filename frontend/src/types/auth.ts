export interface SignInCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    accessToken: string;
}

export interface SignUpCredentials {
    name: string;
    email: string;
    password: string;
}

export interface SignUpResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    accessToken: string;
}

export interface RefreshResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
