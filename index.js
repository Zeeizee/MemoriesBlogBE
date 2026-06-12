import "dotenv/config"

import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import songsRoutes from './routes/songs.js'
import postsRoutes from './routes/post.js'
import imagesRoutes from './routes/images.js'
import authRoutes from './routes/auth.js'
import { seedAdmin } from './utils/seedAdmin.js'

const app=express();


app.use(bodyParser.json({limit:'30mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))
app.use(cors());
app.use('/auth', authRoutes);
app.use('/songs',songsRoutes);
app.use('/posts',postsRoutes);
app.use("/images", imagesRoutes);
app.get('/',(req,res)=>{
    res.send("Welcome to Home webpage");
})


const CONNECTION_URL = process.env.MONGODB_URI
const PORT = process.env.PORT || 5000

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('MongoDB connected')
        await seedAdmin()
        if (!process.env.VERCEL) {
            app.listen(PORT, () => console.log(`server running at port ${PORT}`))
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err)
    })

export default app


