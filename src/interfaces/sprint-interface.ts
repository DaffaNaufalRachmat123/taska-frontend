import { Log } from "./log-interface";

export interface SprintResponse {
    data : SprintData;
    errors : string
}

export interface SprintListResponse {
    data : SprintData[];
    errors : string
}

export interface SprintData {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    organization_code: string;
    created_by: string;
    logs?: Log[];
    creator_name?: string;
}

export interface SprintCreateRequest {
    name : string;
    description : string;
    start_date : string;
    end_date : string;
}

export interface SprintCreateResponse {
    data : SprintData;
    errors : string | null;
}