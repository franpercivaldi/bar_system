const Mesa = require('../models/mesa');
const Bar = require('../models/bar');
const Turno = require('../models/turno');
const { Op } = require('sequelize');


const guardarMesaService = async (mesaData) => {
  try {
    const { bar_id, numero_mesa, monto, propina, tipo_pago } = mesaData;

    // 1. Generar la fecha actual (YYYY-MM-DD)
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0];

    // 2. Definir el turno (ejemplo: 1 = mañana, 2 = tarde)
    const horaActual = fechaActual.getHours();
    let turnoId = null;

    // Hasta las 14:00 es turno 1 (mañana)
    // A partir de las 14:00 es turno 2 (tarde)
    if (horaActual < 16) {
      turnoId = 1;
    } else {
      turnoId = 2;
    }

    // 3. Verificar si el bar existe
    const barExistente = await Bar.findByPk(bar_id);
    if (!barExistente) {
      throw new Error(`El bar con id ${bar_id} no existe.`);
    }

    // 4. Crear la mesa
    const nuevaMesa = await Mesa.create({
      bar_id,
      turno_id: turnoId,
      numero_mesa,
      monto,
      propina,
      tipo_pago,
      fecha: fechaFormateada
    });

    return nuevaMesa;
  } catch (error) {
    throw new Error('Error al guardar la mesa: ' + error.message);
  }
};

  
const getMesasByIdBarService = async (id) => {
    // Retorna todas las mesas de un bar en particular
    console.log('id:', id);
    try {
      const mesas = await Mesa.findAll({
        where: {
          bar_id: id
        },
        include: [
          {
            model: Turno,
            attributes: ['nombre', 'hora_inicio', 'hora_fin']
          }
        ]
      });
      return mesas;
    } catch (error) {
      console.error('Error en getMesasByIdBarService:', error);
      throw new Error('Error al obtener las mesas: ' + error.message);
    }
};

const editarMesaService = async (id, nuevosCampos) => {
  try {
    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      throw new Error('Mesa no encontrada');
    }

    await mesa.update(nuevosCampos);
    return mesa;
  } catch (error) {
    console.error('Error en editarMesaService:', error);
    throw new Error('Error al editar la mesa: ' + error.message);
  }
};

const eliminarMesaService = async (id) => {
  try{
    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      throw new Error('Mesa no encontrada');
    }

    await mesa.destroy();
    return { mensaje: 'Mesa eliminada correctamente' };
  } catch (error) {
    console.error('Error en eliminarMesaService:', error);
    throw new Error('Error al eliminar la mesa: ' + error.message);
  }
}


module.exports = { guardarMesaService, getMesasByIdBarService, editarMesaService, eliminarMesaService };