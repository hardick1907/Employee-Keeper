import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditEmployee.css';

export const EditEmployee = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:3000/employees/${id}`);
        if (!response.ok) {
          throw new Error('Error fetching employee data');
        }
        const data = await response.json();
        
        setValue('Name', data.Name);
        setValue('Email', data.Email);
        setValue('MobileNumber', data.MobileNumber);
        setValue('Designation', data.Designation);
        setValue('Gender', data.Gender);
        setValue('Courses', data.Courses);
        if (selectedImage) formData.append('file', selectedImage);
        // Handle other fields as needed
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchEmployee();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('Name', data.Name);
      formData.append('Email', data.Email);
      formData.append('MobileNumber', data.MobileNumber);
      formData.append('Designation', data.Designation);
      formData.append('Gender', data.Gender);
  
      // Append each course separately to ensure it's sent as an array
      if (Array.isArray(data.Courses)) {
        data.Courses.forEach(course => formData.append('Courses[]', course));
      }
  
      // Append selected image if any
      if (selectedImage) {
        formData.append('file', selectedImage);
      }
  
      const response = await fetch(`http://localhost:3000/employees/${id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (response.status === 422) {
        const errorData = await response.json();
        setEmailError(errorData.message); 
        return;
      }
  
      if (response.ok) {
        navigate('/employeeList');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
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
        <label>Upload New Image</label>
        <input
          type="file"
          {...register("Image")}
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
      </div>

      <button type="submit" className="login-button">Update</button>
    </form>
  );
};
