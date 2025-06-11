export interface Log {
    id: string;
    action: string;
    date: string;
    type: string;
    reference_id: string;
    content: {
        creator_id: string;
        creator_name: string;
        old_status?: string;
        new_status?: string;
        payload: Record<string, any>;
    }
}