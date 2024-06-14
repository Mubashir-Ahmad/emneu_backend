import express from 'express';
import dotenv from 'dotenv'
import { DBconnect } from './db/connect.js';
import userRouter from './routes/userRouter.js'
import menuRouter from './routes/menuRouter.js'
import comapnyRouter from './routes/companyRoute.js'
import presentationRouter from './routes/presentationRouter.js'
import letterheadRouter from './routes/letterheadRoute.js'
import supportRoute from './routes/supportRoute.js'
import cors from 'cors'
import bodyParser from 'body-parser';
import paymentroute from './routes/paymentroute.js'
import cookieParser from 'cookie-parser'
import cloudinary from 'cloudinary'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload' // Uncomment this line
dotenv.config({ path: './config/config.env' })
console.log('saas',process.env.STRIPE_SECRET_KEY)
const s =process.env.STRIPE_SECRET_KEY;
const DATABASE_URL = "mongodb+srv://mubbashirahmad44:bsse02183006@emenu.grf3awb.mongodb.net/";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()
 
// Middleware
app.use(bodyParser.json({ limit: '50mb' }));// Parse JSON bodies
app.use(cors()) // Enable CORS
app.use(cookieParser());
app.use(express.json());
app.use(express.static('./uploads/'))
// app.use(fileUpload()); // Uncomment this line
app.set('view engine', 'ejs');


app.use(express.static(join(__dirname, 'build')));


// Routes
app.use("/users", userRouter)
app.use("/menu", menuRouter)
app.use("/presentation", presentationRouter)
app.use("/letterhead", letterheadRouter)
app.use("/company", comapnyRouter)
app.use("/support", supportRoute)
app.use('/payment', paymentroute)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
const port = process.env.PORT || 3000;
app.get('/*', (req, res) => {
  res.sendFile(join(__dirname, 'build', 'index.html'));
});
const start = async () => {
    try {
        await DBconnect(DATABASE_URL);
        app.listen(port, () =>
            console.log(`Server is Listening on http://localhost:${port}`))
    } catch (error) {
        console.log('Error starting server:', error);
    }
}

start();
 