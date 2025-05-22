// Define a generic ViewState interface with a discriminant "type" property
export type ViewState<T> =
    | { type: 'Loading' }
    | { type: 'Success'; data: T }
    | { type: 'Failed'; message: string | null; code : number }
    | { type : 'Idle' }

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