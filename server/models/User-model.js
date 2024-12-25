import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        title: { type: String, required: true },
        role: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
        team: { type: Schema.Types.ObjectId, ref: "Team" }, // Single team ID
        tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], // Array of task IDs
        isActive: { type: Boolean, required: true, default: true },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;


const teamSchema = new Schema(
    {
        name: { type: String, required: true }, // Name of the team
        description: { type: String }, // Optional description of the team
        admin: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Admin user
        members: [{ type: Schema.Types.ObjectId, ref: "User" }], // Member users
    },
    { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export {Team};
