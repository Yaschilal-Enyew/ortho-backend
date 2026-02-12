import userModel from '../models/userModel.js'
import validator from 'validator'
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET); 
}


// User Registering controller
export const registerUser= async (req, res) => {
    try {
        const {name, email, password, phone, department, year} = req.body;

        if (!name || !email || !password || !phone || !department || !year ) {
      return res.status(400).json({ message: "All fields are required" });
    }

        // checking user already exists or not
        const existedUser = await userModel.findOne({email})
        if(existedUser){
            return res.json({success:false, message:"User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email"})
        }

        if(password.length< 6 ){
            return res.json({success:false, message:"Password must be at least 6 character"});
        }

        // Hashing Password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name, email,
            password:hashedPassword,
            phone, year,
            department
        })

        const user = await newUser.save()

        const token = await createToken(user._id);
        res.json({success:true, token, message:"Registered Successfuly",
           userData:newUser})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
    
}


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Required fields check
    if (!email || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    // 2. Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // 4. Generate token
    const token = createToken(user._id);
    res.json({ success: true, token, message:"Login Successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// Route for admin login
export const adminLogin = async (req, res) => {
    try {
      const {email, password} = req.body;

      if(email===process.env.ADMIN_EMAIL && process.env.ADMIN_PASS){
       
        const token = jwt.sign(email+password,process.env.JWT_SECRET);
       
        res.json({success:true, token})
      }else{
        res.json({success:false, message:"Invalid Credentials"})
      }
    } catch (error) {
       console.log(error);
    res.json({ success: false, message: error.message });
    }
}