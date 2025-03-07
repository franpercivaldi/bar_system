const barService = require('../services/barService');

exports.getAll = async (req, res) => {
  try {
    const bares = await barService.getAllBares();
    res.json(bares);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener bares' });
  }
};

exports.getById = async (req, res) => {
  try {
    const bar = await barService.getBarById(req.params.id);
    if (!bar) return res.status(404).json({ error: 'Bar no encontrado' });
    res.json(bar);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener bar' });
  }
};

exports.create = async (req, res) => {
  try {
    const bar = await barService.createBar(req.body);
    res.status(201).json(bar);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear bar' });
  }
};

exports.update = async (req, res) => {
  try {
    await barService.updateBar(req.params.id, req.body);
    res.json({ message: 'Bar actualizado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar bar' });
  }
};

exports.delete = async (req, res) => {
  try {
    await barService.deleteBar(req.params.id);
    res.json({ message: 'Bar eliminado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar bar' });
  }
};
