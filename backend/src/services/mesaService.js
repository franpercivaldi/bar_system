const Mesa = require('../models/mesa');
const Bar = require('../models/bar');
const Turno = require('../models/turno');
const { Op } = require('sequelize');


const guardarMesaService = async (mesaData) => {
    try {
      const { bar_id, numero_mesa, monto, propina, tipo_pago, fecha } = mesaData;
  
      // Verificar si el bar existe
      const barExistente = await Bar.findByPk(bar_id);
      if (!barExistente) {
        throw new Error(`El bar con id ${bar_id} no existe.`);
      }
  
      // Determinar el turno basado en la hora actual
      const ahora = new Date();
      const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
      console.log(`Hora actual en minutos: ${horaActual}`);
  
      // Obtener todos los turnos
      const turnos = await Turno.findAll();
      console.log('Turnos obtenidos:', turnos.map(t => t.toJSON()));
  
      // Encontrar el turno correcto considerando cruces de medianoche
      let turnoExistente = null;
  
      for (const turno of turnos) {
        const [inicioHoras, inicioMinutos] = turno.hora_inicio.split(':').map(Number);
        const [finHoras, finMinutos] = turno.hora_fin.split(':').map(Number);
  
        const inicioMinutosTotales = inicioHoras * 60 + inicioMinutos;
        const finMinutosTotales = finHoras * 60 + finMinutos;
  
        console.log(`Evaluando turno: ${turno.nombre}`);
        console.log(`Inicio en minutos: ${inicioMinutosTotales}, Fin en minutos: ${finMinutosTotales}`);
  
        if (inicioMinutosTotales < finMinutosTotales) {
          // Turno sin cruce de medianoche
          if (horaActual >= inicioMinutosTotales && horaActual < finMinutosTotales) {
            turnoExistente = turno;
            console.log(`Turno asignado: ${turno.nombre}`);
            break;
          }
        } else {
          // Turno que cruza la medianoche
          if (horaActual >= inicioMinutosTotales || horaActual < finMinutosTotales) {
            turnoExistente = turno;
            console.log(`Turno asignado (cruce medianoche): ${turno.nombre}`);
            break;
          }
        }
      }
  
      if (!turnoExistente) {
        console.error('No se encontró un turno válido para la hora actual.');
        throw new Error('No se encontró un turno válido para la hora actual.');
      }
  
      // Crear la mesa con el turno asignado
      const nuevaMesa = await Mesa.create({
        bar_id,
        turno_id: turnoExistente.id,
        numero_mesa,
        monto,
        propina,
        tipo_pago,
        fecha
      });
  
      console.log('Mesa creada exitosamente:', nuevaMesa.toJSON());
  
      return nuevaMesa;
    } catch (error) {
      console.error('Error en guardarMesaService:', error);
      throw new Error('Error al guardar la mesa: ' + error.message);
    }
};
  
const getMesasService = async () => {
    try {
      const mesas = await Mesa.findAll({
        include: [
          { model: Bar, as: 'bar' },
          { model: Turno, as: 'turno' }
        ],
        order: [['fecha', 'DESC']]
      });
  
      return mesas;
    } catch (error) {
      console.error('Error en getMesasService:', error);
      throw new Error('Error al obtener las mesas: ' + error.message);
    }
};


module.exports = { guardarMesaService, getMesasService };