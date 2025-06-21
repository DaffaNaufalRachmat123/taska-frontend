export interface OrgData {
    name: string;
    code: string;
    description: string;
}

export interface OrgResponse {
    data: OrgData;
    errors: string;
}