    const mongoose = require("mongoose");

    const userSchema = new mongoose.Schema(
    {


    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    
    fullName: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    career: {
        type: String,
        default: "",
    },

    faculty: {
        type: String,
        default: "",
    },

    semester: {
        type: Number,
        default: 1,
        min: 1,
        max: 12,
    },

    bio: {
        type: String,
        default: "",
        maxlength: 300,
    },

    interests: {
        type: [String],
        default: [],
    },

    objectives: {
        type: [String],
        default: [],
    },

    profilePicture: {
        type: String,
        default: "",
    },
    },
    {
    timestamps: true,
    }
    );

    module.exports = mongoose.model("User", userSchema);