import { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Typography,
  Divider,
  Space,
  Spin,
  message,
  Tag,
} from 'antd';
import Header from '../components/Header';
import { getResumenDiario } from '../api/resumes';

const { Title, Text } = Typography;

const format = (n) => `$${(n || 0).toLocaleString()}`;

const ResumenTurno = () => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const data = await getResumenDiario();
        setResumen(data);
        console.log('Resumen del día:', data);
      } catch (err) {
        console.error('Error al obtener resumen:', err);
        message.error('No se pudo cargar el resumen del día');
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, []);

  if (loading || !resumen) {
    return (
      <>
        <Header />
        <Spin style={{ marginTop: 100, display: 'block' }} />
      </>
    );
  }

  const { fecha, turnos } = resumen;

  const calcVentaTarjetas = (turno) =>
    (turnos[turno]?.tarjetas || 0) + (turnos[turno]?.mp || 0);

  const calcEfectivoNeto = (turno) =>
    (turnos[turno]?.efectivo || 0) - (turnos[turno]?.gastos || 0);

  const ventaTotalDia =
    (turnos.mañana?.total || 0) + (turnos.noche?.total || 0);
  const ventaTotalTarjetas =
    calcVentaTarjetas('mañana') + calcVentaTarjetas('noche');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#2c2c2c' }}>
      <Header />
      <Card
        title={<Title level={3} style={{ color: '#e0e0e0' }}>Resumen del día - {fecha}</Title>}
        style={{
          backgroundColor: '#2c2c2c',
          color: '#e0e0e0',
          borderRadius: 10,
          margin: 24,
        }}
        bodyStyle={{ paddingBottom: 0 }}
      >
        {/* Cards de los turnos */}
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={12}>
            <Card
              title="Turno Mañana"
              style={{
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                borderRadius: 10,
              }}
            >
              <Space direction="vertical" size={6}>
                <Text><strong>Venta Total:</strong> {format(turnos.mañana?.total)}</Text>
                <Text><strong>Tarjetas:</strong> {format(turnos.mañana?.tarjetas)}</Text>
                <Text><strong>MP:</strong> {format(turnos.mañana?.mp)}</Text>
                <Text><strong>Venta Efectivo:</strong> {format(turnos.mañana?.efectivo)}</Text>
                <Text>
                  <strong>Gastos:</strong>{' '}
                  <Tag color="red" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {format(turnos.mañana?.gastos)}
                  </Tag>
                </Text>
                <Text strong style={{ color: '#1890ff' }}>
                  Total Efectivo Neto: {format(calcEfectivoNeto('mañana'))}
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title="Turno Noche"
              style={{
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                borderRadius: 10,
              }}
            >
              <Space direction="vertical" size={6}>
                <Text><strong>Venta Total:</strong> {format(turnos.noche?.total)}</Text>
                <Text><strong>Tarjetas:</strong> {format(turnos.noche?.tarjetas)}</Text>
                <Text><strong>MP:</strong> {format(turnos.noche?.mp)}</Text>
                <Text><strong>Venta Efectivo:</strong> {format(turnos.noche?.efectivo)}</Text>
                <Text>
                  <strong>Gastos:</strong>{' '}
                  <Tag color="red" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {format(turnos.noche?.gastos)}
                  </Tag>
                </Text>
                <Text strong style={{ color: '#1890ff' }}>
                  Total Efectivo Neto: {format(calcEfectivoNeto('noche'))}
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#444' }} />

        {/* Totales del día */}
        <Row justify="center">
          <Col xs={24} md={16}>
            <Card
              title="Totales del Día"
              style={{
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                borderRadius: 10,
              }}
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
    </div>
  );
};

export default ResumenTurno;
