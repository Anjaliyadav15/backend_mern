import express, { application } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const app = express() // express se ek app bnata h
app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes

import userRouter from "./routes/user.route.js"
// routes declaration

app.use("/api/v1/users", userRouter)




export {app}