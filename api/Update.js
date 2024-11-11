import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  MobileNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
  Designation: { type: String, required: true },
  Gender: { type: String, required: true, enum: ["Male", "Female"] },
  Courses: { type: [String], required: true, enum: ["MCA", "BCA", "B.Sc"] },
  image: { type: String, required: true },
  isActive: {type: Boolean,default: true,},
}, { timestamps: true });


export const EmployeeModel = mongoose.model('Employee', employeeSchema);
