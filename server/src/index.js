const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");


// Cargar variables de entorno desde .env sin esto no me serviria ni la variable PORT ni la MONGO_URI utilziadas en este archivo
dotenv.config();    


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);



app.get("/", (req, res) => {
    res.send("API funcionando");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});