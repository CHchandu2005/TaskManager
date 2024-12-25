import mongoose from "mongoose";

const URL = "mongodb+srv://chanduchintalapudi:mongodb%402005@cluster0.vild7.mongodb.net/task_manager?retryWrites=true&w=majority&appName=Cluster0";

const connectdb = async () => {
    try {
        await mongoose.connect(URL);
        console.log("Database connection successful");
    } catch (error) {
        console.log("Error connecting to the database:", error.message);
    }
};

export { connectdb };
