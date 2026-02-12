import moduleName from 'module'
import userModel from '../models/userModel.js'
import { json } from 'stream/consumers';

// Get all students except password
export const allStudents = async (req, res) => {
    try {
        const students = await userModel.find({}, "-password"); 
        

        res.status(200).json({
            success: true,
            students
        });

    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};





export const deleteStudents = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

      
        if (updateData.password) {
            delete updateData.password;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password"); 

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            updatedUser
        });

    } catch (error) {
        console.error("Error updating student:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

