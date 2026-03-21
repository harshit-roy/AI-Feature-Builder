const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

const authRoutes = require("./routes/authRoutes")
const testRoutes = require("./routes/testRoutes")
const featureRoutes = require("./routes/featureRoutes")
const previewRoutes = require("./routes/previewRoutes")
const sandboxRoutes = require("./routes/sandboxRoutes")
const adminRoutes = require("./routes/adminRoutes")

app.use("/api/admin", adminRoutes)
app.use("/api/sandbox", sandboxRoutes)
app.use("/preview",previewRoutes)
app.use("/api/features",featureRoutes)
app.use("/api/test",testRoutes)
app.use("/api/auth", authRoutes)

app.get("/",(req,res)=>{
  res.send("AI Feature Builder API running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})
