export interface UserListResponse {
    data : UserData[];
    errors : string
}

export interface UserData {
    id: string;
    name: string;
    email: string;
    organization_code: string
}