import { useForm } from 'react-hook-form';
import { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

export const Login = ({ onLoginSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async (data) => {
    const { Username, Password } = data;

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: Username,
          password: Password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        onLoginSuccess(result);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-main">
      <div className="login-container">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <h2 className="login-title">Welcome</h2>

          <input
            type="text"
            placeholder="Username"
            {...register("Username", { required: "Username is required" })}
            className="login-input"
          />
          {errors.Username && <p className="error-message">{errors.Username.message}</p>}

          <div className="pass-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              style={{ paddingRight: '60px' }}
              {...register("Password", { 
                required: "Password is required", 
                minLength: { value: 7, message: "Password must be at least 7 characters" }
              })}
              className="login-input"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="show-password-btn"
              style={{ marginTop: '20px' }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.Password && <span className="error-message">{errors.Password.message}</span>}
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="new-here">
          <h3>New Admin?</h3>
          <Link to='/register' className='register'>Register</Link>
        </div>
      </div>
    </div>
  );
};
