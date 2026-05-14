const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (req, res, next) => {
try {

    let token;

    // Verificar si existe header Authorization
    if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    ) {

    // Obtener token
    token = req.headers.authorization.split(" ")[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario
    req.user = await User.findById(decoded.id).select("-password");

    next();

    } else {

    return res.status(401).json({
        message: "No autorizado, token faltante",
    });

    }

} catch (error) {

    return res.status(401).json({
    message: "Token inválido",
    });

}
};

module.exports = protect;