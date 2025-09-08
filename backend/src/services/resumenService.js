const Mesa = require('../models/mesa');
const Turno = require('../models/turno');
const Comentario = require('../models/comentario');
const { Op, Sequelize  } = require('sequelize');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const getResumenDiarioService = async (bar_id, fechaISO) => {
  const tz = 'America/Argentina/Buenos_Aires';
  const fechaBase = dayjs.tz(fechaISO, tz);

  const turnos = await Turno.findAll();
  const resumen = { fecha: fechaBase.format('YYYY-MM-DD'), turnos: {} };

  for (const t of turnos) {
    let inicio = dayjs.tz(`${fechaISO} ${t.hora_inicio}`, tz);
    let fin    = dayjs.tz(`${fechaISO} ${t.hora_fin}`, tz);

    if (!fin.isAfter(inicio)) fin = fin.add(1, 'day');

    // usar [inicio, fin) para evitar duplicados
    const mesas = await Mesa.findAll({
      where: {
        bar_id,
        fecha: { [Op.gte]: inicio.utc().toDate(), [Op.lt]: fin.utc().toDate() },
      },
    });

    const comentarios = await Comentario.findAll({
      where: {
        bar_id,
        fecha: { [Op.gte]: inicio.utc().toDate(), [Op.lt]: fin.utc().toDate() },
      },
    });

    const total     = mesas.reduce((s, m) => s + +m.monto, 0);
    const efectivo  = mesas.filter(m => m.tipo_pago === 'Efectivo').reduce((s, m) => s + +m.monto, 0);
    const tarjetas  = mesas.filter(m => m.tipo_pago === 'Tarjeta').reduce((s, m) => s + +m.monto, 0);
    const mp        = mesas.filter(m => m.tipo_pago === 'Mercado Pago').reduce((s, m) => s + +m.monto, 0);
    const gastos    = comentarios.reduce((s, c) => s + +c.monto, 0);

    resumen.turnos[t.nombre.toLowerCase()] = { total, efectivo, tarjetas, mp, gastos };
  }

  return resumen;
};


const getResumenMensualService = async (bar_id, fecha) => {
  // Si no se pasa fecha, usamos la actual
  const fechaReferencia = fecha ? new Date(`${fecha}-01`) : new Date();
  console.log('Esto es fecha referencia =>', fechaReferencia);

  const primerDia = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth(), 1);
  const ultimoDia = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth() + 1, 0);

  const fechaDesde = primerDia.toISOString().split('T')[0];
  const fechaHasta = ultimoDia.toISOString().split('T')[0];

  // 1. Obtener ventas (agrupadas por fecha y tipo_pago)
  const ventas = await Mesa.findAll({
      attributes: [
      'fecha',
      'tipo_pago',
      [Sequelize.fn('SUM', Sequelize.col('monto')), 'total']
      ],
      where: {
      bar_id,
      fecha: { [Op.between]: [fechaDesde, fechaHasta] }
      },
      group: ['fecha', 'tipo_pago'],
      raw: true
  });

  // 2. Obtener gastos en efectivo (comentarios)
  const gastos = await Comentario.findAll({
      attributes: [
      'fecha',
      [Sequelize.fn('SUM', Sequelize.col('monto')), 'total']
      ],
      where: {
      bar_id,
      fecha: { [Op.between]: [fechaDesde, fechaHasta] }
      },
      group: ['fecha'],
      raw: true
  });

  // 3. Organizar los datos por día
  const resumenPorDia = {};

  ventas.forEach((v) => {
      const fecha = v.fecha;
      if (!resumenPorDia[fecha]) {
      resumenPorDia[fecha] = {
          dia: fecha,
          ventaTotal: 0,
          efectivo: 0,
          tarjeta: 0,
          gastos: 0
      };
      }

      const tipo = v.tipo_pago;
      const monto = parseFloat(v.total);

      resumenPorDia[fecha].ventaTotal += monto;

      if (tipo === 'Efectivo') resumenPorDia[fecha].efectivo += monto;
      else if (tipo === 'Tarjeta') resumenPorDia[fecha].tarjeta += monto; // En el mes, juntamos ventas por tarjeta y mercado pago
      else if (tipo === 'Mercado Pago') resumenPorDia[fecha].tarjeta += monto;       
  });

  gastos.forEach((g) => {
      const fecha = g.fecha;
      if (!resumenPorDia[fecha]) {
      resumenPorDia[fecha] = {
          dia: fecha,
          ventaTotal: 0,
          efectivo: 0,
          tarjeta: 0,
          gastos: 0
      };
      }

      resumenPorDia[fecha].gastos = parseFloat(g.total);
  });

  // 4. Convertir a array y ordenar por día
  const resumenFinal = Object.values(resumenPorDia).sort(
      (a, b) => new Date(a.dia) - new Date(b.dia)
  );


  console.log('Esto es resumen final =>', resumenFinal);
  return resumenFinal;
};
  
module.exports = {
getResumenDiarioService,
getResumenMensualService
};