import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Spin,
  message,
  DatePicker,
  Space,
} from 'antd';
import Header from '../components/Header';
import { getMonthSummary } from '../api/resumes';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // 👈 importa español
import locale from 'antd/es/locale/es_ES'; // 👈 idioma de Ant Design
import { ConfigProvider } from 'antd';

dayjs.locale('es'); // 👈 setea globalmente español


const { Title } = Typography;

const format = (n) => `$${(n || 0).toLocaleString()}`;

const MonthSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const fetchMensual = async (month) => {
    try {
      setLoading(true);
      const resumen = await getMonthSummary(month.format('YYYY-MM')); // <-- ejemplo: "2025-04"
      setData(resumen);
    } catch (err) {
      console.error('Error al cargar resumen mensual:', err);
      message.error('No se pudo cargar el resumen mensual');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensual(selectedMonth);
  }, [selectedMonth]);

  const handleMonthChange = (date) => {
    if (date) {
      setSelectedMonth(date);
    }
  };

  const totals = data.reduce(
    (acc, row) => ({
      ventaTotal: acc.ventaTotal + row.ventaTotal,
      efectivo: acc.efectivo + row.efectivo,
      tarjeta: acc.tarjeta + row.tarjeta,
      gastos: acc.gastos + row.gastos,
    }),
    { ventaTotal: 0, efectivo: 0, tarjeta: 0, gastos: 0 }
  );

  const columns = [
    { title: 'Día', dataIndex: 'dia', key: 'dia' },
    {
      title: 'Venta Total',
      dataIndex: 'ventaTotal',
      key: 'ventaTotal',
      align: 'right',
      render: format,
    },
    {
      title: 'Venta Efectivo',
      dataIndex: 'efectivo',
      key: 'efectivo',
      align: 'right',
      render: format,
    },
    {
      title: 'Venta Tarjeta / MP',
      dataIndex: 'tarjeta',
      key: 'tarjeta',
      align: 'right',
      render: format,
    },
    {
      title: 'Gastos en Efectivo',
      dataIndex: 'gastos',
      key: 'gastos',
      align: 'right',
      render: format,
    },
  ];

  const summaryRow = () => (
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}><strong>Totales</strong></Table.Summary.Cell>
      <Table.Summary.Cell index={1} align="right"><strong>{format(totals.ventaTotal)}</strong></Table.Summary.Cell>
      <Table.Summary.Cell index={2} align="right"><strong>{format(totals.efectivo)}</strong></Table.Summary.Cell>
      <Table.Summary.Cell index={3} align="right"><strong>{format(totals.tarjeta)}</strong></Table.Summary.Cell>
      <Table.Summary.Cell index={4} align="right"><strong>{format(totals.gastos)}</strong></Table.Summary.Cell>
    </Table.Summary.Row>
  );

  return (
    <ConfigProvider locale={locale}>
      <div style={{ minHeight: '100vh', backgroundColor: '#2c2c2c' }}>
        <Header />
        <div style={{ padding: 32 }}>
          <Card
            title={
              <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title level={3} style={{ margin: 0 }}>
                  Resumen Mensual
                </Title>
                <DatePicker
                  picker="month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  format="MMMM YYYY"
                  allowClear={false}
                />
              </Space>
            }
            style={{
              backgroundColor: '#1e1e1e',
              color: '#e0e0e0',
              borderRadius: 10,
            }}
            headStyle={{ color: '#e0e0e0' }}
          >
            {loading ? (
              <Spin />
            ) : (
              <Table
                dataSource={data}
                columns={columns}
                rowKey="dia"
                pagination={false}
                summary={summaryRow}
              />
            )}
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default MonthSummary;
