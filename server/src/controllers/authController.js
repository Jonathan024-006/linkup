const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ================= REGISTER =================
const registerUser = async (req, res) => {
try {
    const {
    fullName,
    email,
    password,
    career,
    faculty,
    semester,
    } = req.body;


    if (!fullName || !email || !password) {
    return res.status(400).json({
        message: "Campos obligatorios faltantes",
    });
    }


    if (!email.endsWith("@universidad.edu")) {
    return res.status(400).json({
        message: "Debe usar correo institucional",
    });
    }

    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
    return res.status(400).json({
        message: "Usuario ya existe",
    });
    }

    // 4. Hashear password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Crear usuario
    const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    career,
    faculty,
    semester,
    });

    // 6. Guardar usuario
    await newUser.save();

    // 7. Respuesta
    res.status(201).json({
    message: "Usuario registrado correctamente",
    });

} catch (error) {
    res.status(500).json({
    message: "Error en register",
    error: error.message,
    });
}
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
    return res.status(400).json({
        message: "Usuario no encontrado",
    });
    }

    // 2. Comparar password
    const isMatch = await bcrypt.compare(
    password,
    user.password
    );

    if (!isMatch) {
    return res.status(400).json({
        message: "Password incorrecta",
    });
    }

    // 3. Generar JWT
    const token = jwt.sign(
    {
        id: user._id,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d",
    }
    );

    // 4. Retornar token
    res.status(200).json({
    message: "Login exitoso",
    token,
    user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
    },
    });

} catch (error) {
    res.status(500).json({
    message: "Error en login",
    error: error.message,
    });
}
};

module.exports = {
registerUser,
loginUser,
};