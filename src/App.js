
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import {RegisterPage} from './components/RegisterPage';
import React from 'react';
import { MainPage } from './components/MainPage';

export const Context = React.createContext();

function App() {
  const backendLocation = 'http://localhost:8080/api'
  return (
    <Context.Provider value = {{backendLocation}}>
      <div className="App h-[100vh] roboto-regular flex items-center justify-center">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Context.Provider>
  );
}

export default App;
