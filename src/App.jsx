import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Profile } from "./components/Profile";
import { Login } from "./components/Login";
import { Employees } from "./components/Employees";
import { Home } from "./components/Home";
import { CreateEmployee } from './components/CreateEmployee';
import { Register } from "./components/Register";
import { Navbar } from './components/Navbar';
import { useState, useEffect } from "react";
import { EditEmployee } from "./components/EditEmployee ";

export const App = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  
  
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });

  useEffect(() => {
    
    localStorage.setItem("isLoggedIn", isLoggedIn);
    if (isLoggedIn) {
      localStorage.setItem("username", username); 
    } else {
      localStorage.removeItem("username");
    }
  }, [isLoggedIn, username]);

  
  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUsername(user.username);
    localStorage.setItem("name", user.name);
    localStorage.setItem("email", user.email);
    localStorage.setItem("bio", user.bio);
    localStorage.setItem("city", user.city); 
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(""); 
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      
      {isLoggedIn && <Navbar username={username} onLogout={handleLogout} />} 
      
      <Routes>
        
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/home" /> : <Login onLoginSuccess={handleLoginSuccess} />}
        />
        
       
        <Route 
          path="/home" 
          element={isLoggedIn ? <Home /> : <Navigate to="/" />} 
        />
        <Route 
          path="/employeeList" 
          element={isLoggedIn ? <Employees /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile" 
          element={isLoggedIn ? <Profile/> : <Navigate to="/" />} 
        />
        <Route 
          path="/createemployee" 
          element={isLoggedIn ? <CreateEmployee /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/register" 
          element={<Register />} 
        />

        <Route
          path="/editemployee/:id"
          element={<EditEmployee/>}
        />


      </Routes>

    </Router>
  );
};
