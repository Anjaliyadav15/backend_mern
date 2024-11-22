import express, { application } from "express"
import cookieParser from "cookie-parser" //to perform crud operation on cookie of other
import cors from "cors"


const app = express() // express se ek app bnata h
app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json({limit: "16kb"})) //we must apply the json limit
app.use(express.urlencoded({extended: true, limit: "16kb"})) //when data comes from url and url encodes the data as data may be different  
app.use(express.static("public")) //if i want to store files and folder in my server
app.use(cookieParser()) 

// routes

import userRouter from "./routes/user.route.js"
// routes declaration

app.use("/api/v1/users", userRouter)




export {app}