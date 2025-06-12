export interface LoginResponse {
    data : LoginData;
    errors : string
}

export interface RegisterResponse {
    data : LoginData;
    errors : string;
}

export interface LoginData {
    token : string;
    expired_at : string;
    role : string;
    lifetime : number;
}

export interface LoginRequest {
    email : string;
    password : string;
}

export interface RegisterRequest {
    email : string;
    password : string;
    confirmPassword : string;
    name : string;
    organization_code : string;
}