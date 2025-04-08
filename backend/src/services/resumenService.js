const Mesa = require('../models/mesa');
const Turno = require('../models/turno');
const Comentario = require('../models/comentario');
const { Op, Sequelize  } = require('sequelize');

const getResumenDiarioService = async (bar_id) => {
  const fechaHoy = new Date().toISOString().split('T')[0];

  const resumen = {
    fecha: fechaHoy,
    turnos: {},
  };

  const turnos = await Turno.findAll();

  for (const turno of turnos) {
    const mesas = await Mesa.findAll({
      where: {
        bar_id,
        turno_id: turno.id,
        fecha: fechaHoy,
      },
    });

    const total = mesas.reduce((acc, m) => acc + parseFloat(m.monto), 0);
    const efectivo = mesas
      .filter((m) => m.tipo_pago === 'Efectivo')
      .reduce((acc, m) => acc + parseFloat(m.monto), 0);
    const tarjetas = mesas
      .filter((m) => m.tipo_pago === 'Tarjeta')
      .reduce((acc, m) => acc + parseFloat(m.monto), 0);
    const mp = mesas
      .filter((m) => ['Mercado Pago'].includes(m.tipo_pago))
      .reduce((acc, m) => acc + parseFloat(m.monto), 0);

    const comentarios = await Comentario.findAll({
      where: {
        bar_id,
        fecha: fechaHoy,
      },
    });

    const gastos = comentarios.reduce((acc, c) => acc + parseFloat(c.monto), 0);

    resumen.turnos[turno.nombre.toLowerCase()] = {
      total,
      efectivo,
      tarjetas,
      mp,
      gastos,
    };
  }

  console.log('Esto es resumen =>', resumen);
  return resumen;
};

const getResumenMensualService = async (bar_id) => {
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

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