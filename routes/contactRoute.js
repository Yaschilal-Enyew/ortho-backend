import express from 'express'
import { sendContactInfo } from '../controllers/contactController.js';
import authUser from '../middleware/auth.js';

const contactRoute = express.Router();


contactRoute.post('/contact', sendContactInfo);

export default contactRoute;