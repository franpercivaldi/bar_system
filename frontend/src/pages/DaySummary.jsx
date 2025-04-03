import { Card, Col, Row, Typography, Divider, Space } from 'antd';

const { Title, Text } = Typography;

const format = (n) => `$${n.toLocaleString()}`;

const ResumenTurno = () => {
  const resumen = {
    fecha: '02-01-24',
    turnos: {
      mañana: {
        total: 344300,
        tarjetas: 182350,
        mp: 88150,
        efectivo: 73800,
        gastos: 10420,
      },
      noche: {
        total: 520900,
        tarjetas: 366500,
        mp: 57100,
        efectivo: 97300,
        gastos: 91100,
      },
    },
  };

  const calcVentaTarjetas = (turno) =>
    resumen.turnos[turno].tarjetas + resumen.turnos[turno].mp;

  const calcEfectivoNeto = (turno) =>
    resumen.turnos[turno].efectivo - resumen.turnos[turno].gastos;

  const ventaTotalDia =
    resumen.turnos.mañana.total + resumen.turnos.noche.total;

  const ventaTotalTarjetas =
    calcVentaTarjetas('mañana') + calcVentaTarjetas('noche');

  return (
    <Card
      title={<Title level={3}>Resumen del día - {resumen.fecha}</Title>}
      style={{ margin: 32, backgroundColor: '#fdfdfd', borderRadius: 12 }}
      bodyStyle={{ padding: 24 }}
    >
      <Row gutter={32}>
        {/* TURNO MAÑANA */}
        <Col span={12}>
          <Card title="Turno Mañana" bordered={false} style={{ borderRadius: 10 }}>
            <Space direction="vertical" size={6}>
              <Text><strong>Venta Total:</strong> {format(resumen.turnos.mañana.total)}</Text>
              <Text><strong>Tarjetas:</strong> {format(resumen.turnos.mañana.tarjetas)}</Text>
              <Text><strong>MP / Transfer:</strong> {format(resumen.turnos.mañana.mp)}</Text>
              <Text><strong>Total Tarjetas + MP:</strong> {format(calcVentaTarjetas('mañana'))}</Text>
              <Text><strong>Venta Efectivo:</strong> {format(resumen.turnos.mañana.efectivo)}</Text>
              <Text><strong>Gastos:</strong> {format(resumen.turnos.mañana.gastos)}</Text>
              <Text strong style={{ color: '#1890ff' }}>
                Total Efectivo Neto: {format(calcEfectivoNeto('mañana'))}
              </Text>
            </Space>
          </Card>
        </Col>

        {/* TURNO NOCHE */}
        <Col span={12}>
          <Card title="Turno Noche" bordered={false} style={{ borderRadius: 10 }}>
            <Space direction="vertical" size={6}>
              <Text><strong>Venta Total:</strong> {format(resumen.turnos.noche.total)}</Text>
              <Text><strong>Tarjetas:</strong> {format(resumen.turnos.noche.tarjetas)}</Text>
              <Text><strong>MP / Transfer:</strong> {format(resumen.turnos.noche.mp)}</Text>
              <Text><strong>Total Tarjetas + MP:</strong> {format(calcVentaTarjetas('noche'))}</Text>
              <Text><strong>Venta Efectivo:</strong> {format(resumen.turnos.noche.efectivo)}</Text>
              <Text><strong>Gastos:</strong> {format(resumen.turnos.noche.gastos)}</Text>
              <Text strong style={{ color: '#1890ff' }}>
                Total Efectivo Neto: {format(calcEfectivoNeto('noche'))}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* TOTALES DEL DÍA */}
      <Row justify="center">
        <Col span={16}>
          <Card
            title="Totales del Día"
            bordered={false}
            style={{ backgroundColor: '#fafafa', borderRadius: 10 }}
          >
            <Space direction="vertical" size={6}>
              <Text strong style={{ fontSize: 16 }}>
                Venta Total Día: {format(ventaTotalDia)}
              </Text>
              <Text strong style={{ fontSize: 16 }}>
                Venta Total Tarjetas: {format(ventaTotalTarjetas)}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default ResumenTurno;
