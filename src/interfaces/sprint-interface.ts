import { Log } from "./log-interface";

export interface SprintResponse {
    data : SprintData;
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