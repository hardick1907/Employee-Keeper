import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { AdminModel } from '../api/Register.js';
import { EmployeeModel } from '../api/Update.js'; 
import { promises as fsPromises } from 'fs';




const app = express();
const port = 3000;
const secret = 'wedfvbnju7654ew34#@cri34i2ctmncjw4#RIn49u49cnr49';
const uploadMiddleware = multer({ dest: 'uploads/' })
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




mongoose.connect('mongodb+srv://bhadauriahardick:VHcNlcuYYQV15nIP@cluster0.t2rgm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');




app.post('/createemployee', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop(); // Get the file extension
    newPath = `${path}.${ext}`; // Construct the new path with the extension

    try {
      await fsPromises.rename(path, newPath); // Rename asynchronously
    } catch (err) {
      console.error('Error renaming file:', err);
      return res.status(500).json({ error: 'Error renaming file', details: err.message });
    }
  }

  const { Name, Email, MobileNumber, Designation, Gender, Courses } = req.body;

  try {
    const existingEmployee = await EmployeeModel.findOne({ Email });
    if (existingEmployee) {
      return res.status(422).json({ message: 'Email already exists' });
    }

    await EmployeeModel.create({
      Name,
      Email,
      MobileNumber,
      Designation,
      Gender,
      Courses,
      image: newPath,
    });

    res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating employee', details: error.message });
  }
});




app.post('/register', async (req, res) => {
  const { name, password, username, email, bio, city } = req.body;

  try {
    
    const existingAdmin = await AdminModel.findOne({ username });
    if (existingAdmin) {
      return res.status(422).json({ message: 'Username already exists' });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    await AdminModel.create({
      name,
      password: hashedPassword,
      username,
      email,
      bio,
      city
    });
    
    res.status(201).json({ message: 'Admin registered successfully' });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error registering admin', details: error.message });
  }
});




app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await AdminModel.findOne({ username });
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        
        const token = jwt.sign({ userId: user._id, username: user.username }, secret, {
            expiresIn: '1h',
        });

        
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
        });

        res.status(200).json({
            message: 'Logged in successfully',
            username: user.username,
            name: user.name,
            email: user.email,
            bio: user.bio,
            city: user.city,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in', details: error.message });
    }
});






app.get('/employees', async (req, res) => {
    
    try {
      const employees = await EmployeeModel.find();
      res.status(200).json(employees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching employees', details: error.message });
    }
});



app.get('/employees/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const employee = await EmployeeModel.findById(id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.status(200).json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching employee', details: error.message });
    }
});

app.put('/employees/:id', uploadMiddleware.single('file'), async (req, res) => {
    try {
      const { id } = req.params;
      let newPath = null;
  
      
      if (req.file) {
        const { originalname, path } = req.file;
        const ext = originalname.split('.').pop();
        newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);
      }
  
      
      const updateData = {
        ...req.body,
        image: newPath || req.body.image,
      };
  
      
      const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json({ message: 'Employee updated successfully', updatedEmployee });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating employee', details: error.message });
    }
});
  


app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);
      if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting employee', details: error.message });
    }
});



app.patch('/employees/:id/status', async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;


    try {
        const employee = await EmployeeModel.findById(id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        
        employee.isActive = isActive;
        await employee.save();

        res.status(200).json(employee);
    } catch (error) {
        console.error("Detailed error updating employee status:", error);
        res.status(500).json({ error: 'Error updating employee status', details: error.message, stack: error.stack });
    }
});

  
  


app.post('/logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0) }).json('ok');
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
