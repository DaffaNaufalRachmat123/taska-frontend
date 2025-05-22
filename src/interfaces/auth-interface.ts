export interface LoginResponse {
    data : LoginData;
    errors : string
}

export interface LoginData {
    token : string;
    expired_at : string;
    lifetime : number;
}

export interface LoginRequest {
    email : string;
    password : string;
}