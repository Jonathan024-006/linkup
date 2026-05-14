const User = require("../models/User");

// GET /api/users/me
const getMyProfile = async (req, res) => {
try {
    res.status(200).json(req.user);
} catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error: error.message });
}
};

const getUserById = async (req, res) => {
    try{
        const id = req.params.id;

        const user = await User.findById(id).select("-password -email");    

        if (!user) { return res.status(404).json({ message: "Usuario no encontrado" }); }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({_id: {$ne: req.user._id}}).select("-password -email");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
};

const updateMyProfile = async (req, res) => {
try {
    const allowedFields = [
    "bio",
    "interests",
    "objectives",
    "career",
    "faculty",
    "semester",
    "profilePicture",
    ];

    // Validaciones
    if (req.body.semester !== undefined) {
    const sem = req.body.semester;
    if (sem < 1 || sem > 12) {
        return res.status(400).json({ message: "El semestre debe estar entre 1 y 12" });
    }
    }

    if (req.body.bio !== undefined) {
    req.body.bio = req.body.bio.trim();
    if (req.body.bio.length > 300) {
        return res.status(400).json({ message: "La bio no puede superar 300 caracteres" });
    }
    }

    if (req.body.interests !== undefined) {
    if (!Array.isArray(req.body.interests)) {
        return res.status(400).json({ message: "interests debe ser un array" });
    }
    if (req.body.interests.length > 10) {
        return res.status(400).json({ message: "No puedes seleccionar más de 10 intereses" });
    }
    }

    if (req.body.objectives !== undefined) {
    if (!Array.isArray(req.body.objectives)) {
        return res.status(400).json({ message: "objectives debe ser un array" });
    }
    if (req.body.objectives.length > 5) {
        return res.status(400).json({ message: "No puedes seleccionar más de 5 objetivos" });
    }
    }

    if (req.body.career !== undefined) {
    if (typeof req.body.career !== "string" || req.body.career.trim() === "") {
        return res.status(400).json({ message: "La carrera no puede estar vacía" });
    }
    req.body.career = req.body.career.trim();
    }

    if (req.body.faculty !== undefined) {
    if (typeof req.body.faculty !== "string" || req.body.faculty.trim() === "") {
        return res.status(400).json({ message: "La facultad no puede estar vacía" });
    }
    req.body.faculty = req.body.faculty.trim();
    }

    const updateData = {};
    allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
    }
    });


    const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updatedUser);
} catch (error) {
    res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
}
};

module.exports = { getMyProfile, updateMyProfile , getUserById, getAllUsers };