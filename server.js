import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import newsRoute from './routes/newsRoute.js';
import studentRoute from './routes/studentRoute.js';
import contactRoute from './routes/contactRoute.js';
import courseRoute from "./routes/courseRoute.js";
import lessonRoute from "./routes/lessonRoute.js";
import quizRoute from "./routes/quizRoute.js";


// App config
const app = express()
const PORT = process.env.PORT || 5000
connectDB();


// Middlewares
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",          // Vite local (frontend)
  "http://localhost:3000",          // Optional local
  "https://eotc-omega.vercel.app",  // Main frontend
  "https://eotc-admin.vercel.app"   // Admin panel
];

app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server & tools like Postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));



// api endpoints
app.use('/api/user', userRouter)
app.use('/api/news', newsRoute)
app.use('/api/student', studentRoute)
app.use('/api/comment', contactRoute)
app.use("/api/courses", courseRoute);
app.use("/api/lessons", lessonRoute);
app.use("/api/quizzes", quizRoute);

app.get('/',(req, res)=>{res.send("API is Live!")});


app.listen(PORT, ()=>{
    console.log(`Server is starting on ${PORT}...`)
})
