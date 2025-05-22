import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import { AuthLayout } from './components/layouts/AuthLayout';
import menus from './routes/routes';
import { AdminLayout } from './components/layouts/AdminLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/admin" element={<AdminLayout />}>
        {
          menus.map((menu, i) => (
            <Route path={menu.link} element={React.createElement(menu.element)} />
          ))
        }
      </Route>
      <Route path="/auth" element={<AuthLayout />} />
    </Routes>
    // return (
    //   <div className="App">
    //     <div className="container mx-auto p-4">
    //     <div className="board flex overflow-x-auto space-x-4">
    //     <div className="board-column w-64 flex-shrink-0 overflow-y-auto h-96 bg-gray-100 p-4 rounded-md shadow-md">
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 1</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 2</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 3</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 4</div>
    //     </div>

    //     <div className="board-column w-64 flex-shrink-0 overflow-y-auto h-96 bg-gray-100 p-4 rounded-md shadow-md">
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 1</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 2</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 3</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 4</div>
    //     </div>

    //     <div className="board-column w-64 flex-shrink-0 overflow-y-auto h-96 bg-gray-100 p-4 rounded-md shadow-md">
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 1</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 2</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 3</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 4</div>
    //     </div>
    //     <div className="board-column w-64 flex-shrink-0 overflow-y-auto h-96 bg-gray-100 p-4 rounded-md shadow-md">
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 1</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 2</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 3</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 4</div>
    //     </div>
    //     <div className="board-column w-64 flex-shrink-0 overflow-y-auto h-96 bg-gray-100 p-4 rounded-md shadow-md">
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 1</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 2</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 3</div>
    //       <div className="card h-32 bg-white mb-4 p-2 shadow-sm">Card 4</div>
    //     </div>

    //     </div>
    //   </div>

    //   </div>
  );
}

export default App;
