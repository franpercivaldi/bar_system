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
  DatePicker,
  Button,
  ConfigProvider,
} from 'antd';
import Header from '../components/Header';
import { getResumenDiario } from '../api/resumes';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import locale from 'antd/es/locale/es_ES';

dayjs.locale('es');

const { Title, Text } = Typography;

const formatCurrency = (n) => `$${(n || 0).toLocaleString()}`;

const ResumenTurno = () => {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // hoy por defecto

  const fetchResumen = async (date) => {
    try {
      setLoading(true);
      const data = await getResumenDiario(date.format('YYYY-MM-DD'));
      setResumen(data);
    } catch (err) {
      console.error('Error al obtener resumen:', err);
      message.error('No se pudo cargar el resumen del día');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumen(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const resetToToday = () => setSelectedDate(dayjs());

  if (loading || !resumen) {
    return (
      <>
        <Header />
        <Spin style={{ marginTop: 100, display: 'block' }} />
      </>
    );
  }

  const { turnos } = resumen; // asumimos que el backend ya nos devuelve las cifras

  const calcVentaTarjetas = (turno) =>
    (turnos[turno]?.tarjetas || 0) + (turnos[turno]?.mp || 0);

  const calcEfectivoNeto = (turno) =>
    (turnos[turno]?.efectivo || 0) - (turnos[turno]?.gastos || 0);

  const ventaTotalDia =
    (turnos.mañana?.total || 0) + (turnos.noche?.total || 0);
  const ventaTotalTarjetas =
    calcVentaTarjetas('mañana') + calcVentaTarjetas('noche');

  return (
    <ConfigProvider locale={locale}>
      <div style={{ minHeight: '100vh', backgroundColor: '#2c2c2c' }}>
        <Header />
        <Card
          title={
            <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ color: '#e0e0e0', margin: 0 }}>
                Resumen del día - {selectedDate.format('DD/MM/YYYY')}
              </Title>
              <Space>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  allowClear={false}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
                <Button onClick={resetToToday}>
                  Hoy
                </Button>
              </Space>
            </Space>
          }
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
                  <Text><strong>Venta Total:</strong> {formatCurrency(turnos.mañana?.total)}</Text>
                  <Text><strong>Tarjetas:</strong> {formatCurrency(turnos.mañana?.tarjetas)}</Text>
                  <Text><strong>MP:</strong> {formatCurrency(turnos.mañana?.mp)}</Text>
                  <Text><strong>Venta Efectivo:</strong> {formatCurrency(turnos.mañana?.efectivo)}</Text>
                  <Text>
                    <strong>Gastos:</strong>{' '}
                    <Tag color="red" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {formatCurrency(turnos.mañana?.gastos)}
                    </Tag>
                  </Text>
                  <Text strong style={{ color: '#1890ff' }}>
                    Total Efectivo Neto: {formatCurrency(calcEfectivoNeto('mañana'))}
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
                  <Text><strong>Venta Total:</strong> {formatCurrency(turnos.noche?.total)}</Text>
                  <Text><strong>Tarjetas:</strong> {formatCurrency(turnos.noche?.tarjetas)}</Text>
                  <Text><strong>MP:</strong> {formatCurrency(turnos.noche?.mp)}</Text>
                  <Text><strong>Venta Efectivo:</strong> {formatCurrency(turnos.noche?.efectivo)}</Text>
                  <Text>
                    <strong>Gastos:</strong>{' '}
                    <Tag color="red" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {formatCurrency(turnos.noche?.gastos)}
                    </Tag>
                  </Text>
                  <Text strong style={{ color: '#1890ff' }}>
                    Total Efectivo Neto: {formatCurrency(calcEfectivoNeto('noche'))}
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
                    Venta Total Día: {formatCurrency(ventaTotalDia)}
                  </Text>
                  <Text strong style={{ fontSize: 16 }}>
                    Venta Total Tarjetas: {formatCurrency(ventaTotalTarjetas)}
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default ResumenTurno;
