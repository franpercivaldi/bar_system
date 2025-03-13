const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Bar = require("../models/bar");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// **Registro de un bar**
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existingBar = await Bar.findOne({ where: { email } });
    if (existingBar) return res.status(400).json({ msg: "El email ya está en uso" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newBar = await Bar.create({ nombre, email, password: hashedPassword });

    res.status(201).json({ msg: "Registro exitoso", bar: { id: newBar.id, nombre: newBar.nombre, email: newBar.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **Login de bares**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const bar = await Bar.findOne({ where: { email } });
    if (!bar) return res.status(400).json({ msg: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, bar.password);
    if (!isMatch) return res.status(400).json({ msg: "Credenciales incorrectas" });

    const token = jwt.sign({ id: bar.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, bar: { id: bar.id, nombre: bar.nombre, email: bar.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **Middleware para verificar JWT**
const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "Acceso denegado" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.bar = verified.id;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token inválido" });
  }
};

// **Ruta protegida para obtener datos del bar autenticado**
router.get("/perfil", auth, async (req, res) => {
  try {
    const bar = await Bar.findByPk(req.bar, { attributes: { exclude: ["password"] } });
    if (!bar) return res.status(404).json({ msg: "Bar no encontrado" });

    res.json(bar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
