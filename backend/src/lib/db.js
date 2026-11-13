import mongoose from "mongoose"
import dns from "node:dns"

// Use public DNS for Atlas SRV records when the local resolver refuses them.
dns.setServers(["8.8.8.8", "8.8.4.4"])

export const connectDB=async()=>{
    try {
      const Connected= await mongoose.connect(process.env.MONGO_URI)
      console.log(`MongoDB Connected: ${Connected.connection.host}`)
      return Connected
    } catch (error) {
        console.log("Error connecting to MongoDB",error)
        process.exit(1)
    }
}
