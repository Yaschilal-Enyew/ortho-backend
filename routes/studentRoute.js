import express from 'express'
import { allStudents, deleteStudents, updateStudent } from '../controllers/studentController.js';
import adminAuth from '../middleware/adminAuth.js';

const studentRoute = express.Router()


studentRoute.get('/all', adminAuth, allStudents);
studentRoute.delete("/delete/:id", adminAuth, deleteStudents);
studentRoute.put("/update/:id", adminAuth, updateStudent);





export default studentRoute;