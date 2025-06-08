// Define a generic ViewState interface with a discriminant "type" property
export interface ViewState<T> {
    type: 'Loading' | 'Success' | 'Failed' | 'Idle';
    data?: T; // Optional data for Success state
    errors?: string; // Optional error message for Failed state
    message?: string | null; // Optional message for Success and Failed states
    code?: number; // Optional error code for Failed state
}

export type StatusState = 
    | { type : 'Loading' }
    | { type : 'Success' , message : string | null; }
    | { type : 'Failed' , message : string | null; }
    | { type : 'Idle' }
// Example usage:

// interface UserModel {
//     id: number;
//     name: string;
//     email: string;
// }

// // Example of using ViewState with a UserModel
// const userViewState: ViewState<UserModel> = {
//     type: 'Success',
//     data: {
//         id: 1,
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//     }
// };

// // Handling different states
// function handleViewState<T>(state: ViewState<T>) {
//     switch (state.type) {
//         case 'Loading':
//             console.log('Loading...');
//             break;
//         case 'Success':
//             console.log('Success with data:', state.data);
//             break;
//         case 'Failed':
//             console.log('Failed with message:', state.message);
//             break;
//     }
// }

// // Example of handling a ViewState
// handleViewState(userViewState);