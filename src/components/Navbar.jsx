import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import test_logo from '../assets/test_logo.png';

export const Navbar = ({ username, onLogout }) => { 
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault(); 
    try {
      await fetch('http://localhost:3000/logout', { method: 'POST' });
      
      if (onLogout) {
        onLogout(); 
      }

      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <img src={test_logo} className="logo" alt="logo" />
          </div>
          <ul className="navbar-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/employeeList">Employee List</Link></li>
            <li><Link to="/profile">{username}</Link></li>
            <li><a href="/logout" onClick={handleLogout}>Logout</a></li>
          </ul>
        </div>
      </nav>
    </div> 
  );
};
