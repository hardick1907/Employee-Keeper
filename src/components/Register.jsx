/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import './register.css';
import { Navigate } from 'react-router-dom';

export const Register = () => {
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.Name,
          email: data.Email,
          city: data.City,
          username: data.Username,
          bio: data.Bio,
          password: data.Password,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        <Navigate to='/'/>
      } else {
        setMessage(result.message || 'Error registering');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-main">
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="register-input-group">
            <label htmlFor="Name">Name</label>
            <input 
              type="text" 
              id="Name" 
              className="register-input" 
              placeholder="Name" 
              {...formRegister("Name", { required: "Name is required" })}
            />
            {errors.Name && <p className="error-message">{errors.Name.message}</p>}
          </div>

          <div className="register-input-group">
            <label htmlFor="Email">Email</label>
            <input 
              type="email" 
              id="Email" 
              className="register-input" 
              placeholder="Email" 
              {...formRegister("Email", { required: "Email is required" })}
            />
            {errors.Email && <p className="error-message">{errors.Email.message}</p>}
          </div>

          <div className="register-input-group">
            <label htmlFor="City">City</label>
            <input 
              type="text" 
              id="City" 
              className="register-input" 
              placeholder="City" 
              {...formRegister("City", { required: "City is required" })}
            />
            {errors.City && <p className="error-message">{errors.City.message}</p>}
          </div>

          <div className="register-input-group">
            <label htmlFor="Username">Username</label>
            <input 
              type="text" 
              id="Username" 
              className="register-input" 
              placeholder="Username" 
              {...formRegister("Username", { required: "Username is required" })}
            />
            {errors.Username && <p className="error-message">{errors.Username.message}</p>}
          </div>

          <div className="register-input-group">
            <label htmlFor="Bio">Bio</label>
            <input 
              type="text" 
              id="Bio" 
              className="register-input" 
              placeholder="Bio" 
              {...formRegister("Bio", { maxLength: { value: 100, message: "Bio cannot exceed 100 characters" } })}
            />
            {errors.Bio && <p className="error-message">{errors.Bio.message}</p>}
          </div>

          <div className="register-input-group">
            <label htmlFor="Password">Password</label>
            <input 
              type="password" 
              id="Password" 
              className="register-input" 
              placeholder="Password" 
              {...formRegister("Password", { 
                required: "Password is required", 
                minLength: { value: 7, message: "Password must be at least 7 characters" }
              })}
            />
            {errors.Password && <p className="error-message">{errors.Password.message}</p>}
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          {message && <p className="register-message">{message}</p>}

          <div className="new-here">
            <p>Already have an account?</p>
            <a href="/" className="register">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
