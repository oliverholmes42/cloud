import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "./AuthContext";

import './base.css';
import { Toaster } from 'react-hot-toast';
import LoginPage from "./login/LoginPage";
import Main from "./Main";

function App() {
  // Move this inside the AuthProvider
  return (
    <AuthProvider>
      <AuthContent />
      <Toaster position="bottom-right" reverseOrder={false} />
    </AuthProvider>
  );
}

function AuthContent() {
  const { user } = useContext(AuthContext); // Get user data from AuthContext
  
  return user ? <Main /> : <LoginPage />;
}

export default App;
