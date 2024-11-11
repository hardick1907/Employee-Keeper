import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './CreateEmployee.css';

export const CreateEmployee = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [emailError, setEmailError] = useState('');


  const navigate = useNavigate();
  

  const onSubmit = async (data) => {
    setEmailError(''); // Reset email error

    const formData = new FormData();
    formData.append("Name", data.Name);
    formData.append("Email", data.Email);
    formData.append("MobileNumber", data.MobileNumber);
    formData.append("Designation", data.Designation);
    formData.append("Gender", data.Gender);
    data.Courses.forEach(course => formData.append("Courses", course)); 
    if (data.Image && data.Image[0]) {
      formData.append('file', data.Image[0]);
    }

    try {
      const response = await fetch('http://localhost:3000/createemployee', {
        method: 'POST',
        body: formData,
        credentials: 'include', 
      });

      if (response.ok) {
        navigate('/employeeList');
      } else if (response.status === 422) {
        const errorData = await response.json();
        setEmailError(errorData.message); // Set email error message
      } else {
        console.error('Error creating post:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input
          type="text"
          className='employee-name'
          placeholder="Name"
          {...register("Name", { required: "Name is required" })}
        />
        {errors.Name && <p className="error">{errors.Name.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          {...register("Email", { required: "Email is required" })}
        />
        {errors.Email && <p className="error">{errors.Email.message}</p>}
        {emailError && <p className="error">{emailError}</p>}
      </div>

      <div>
        <label>Contact</label>
        <input
          type="tel"
          placeholder="Mobile Number"
          {...register("MobileNumber", { 
            required: "Mobile number is required", 
            pattern: {
              value: /^[0-9]{10}$/, 
              message: "Invalid mobile number"
            }
          })}
        />
        {errors.MobileNumber && <p className="error">{errors.MobileNumber.message}</p>}
      </div>

      <div>
        <label>Designation</label>
        <select {...register("Designation", { required: "Designation is required" })}>
          <option value="">Select</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>
        {errors.Designation && <p className="error">{errors.Designation.message}</p>}
      </div>

      <div>
        <label>Gender</label>
        <label>
          Male&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            {...register("Gender", { required: "Gender is required" })}
            type="radio"
            value="Male"
          />
        </label>
        <label>
          Female
          <input
            {...register("Gender", { required: "Gender is required" })}
            type="radio"
            value="Female"
          />
        </label>
        {errors.Gender && <p className="error">{errors.Gender.message}</p>}
      </div>

      <div>
        <label>Courses</label>
        <label>
          <input
            type="checkbox"
            {...register("Courses", { required: "At least one course is required" })}
            value="MCA"
          />
          MCA
        </label>
        <label>
          <input
            type="checkbox"
            {...register("Courses", { required: "At least one course is required" })}
            value="BCA"
          />
          BCA
        </label>
        <label>
          <input
            type="checkbox"
            {...register("Courses", { required: "At least one course is required" })}
            value="B.Sc"
          />
          B.Sc
        </label>
        {errors.Courses && <p className="error">{errors.Courses.message}</p>}
      </div>

      <div>
        <label>Upload Image</label>
        <input
          type="file"
          {...register("Image", { required: "Image is required" })}
        />
        {errors.Image && <p className="error">{errors.Image.message}</p>}
      </div>

      <button type="submit" className="login-button">Submit</button>
    </form>
  );
};
