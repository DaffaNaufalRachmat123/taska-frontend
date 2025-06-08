import { Log } from "./log-interface";

export interface TaskResponse {
    data : TaskData;
    errors : string
}

export interface TaskListResponse {
    data : TaskData[];
    errors : string
}

export interface TaskData {
    id: string;
    name: string;
    sprint_id: string;
    description: string;
    status: string;
    priority: number;
    story_point: number;
    reporter_id: string;
    assignee_id: string;
    type: string;
    reporter_name?: string;
    assignee_name?: string;
    logs?: Log[];
}