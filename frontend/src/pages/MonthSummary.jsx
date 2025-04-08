import { useEffect, useState } from 'react';
import { Table, Card, Typography, Spin, message } from 'antd';
import Header from '../components/Header';
import { getMonthSummary } from '../api/resumes';

const { Title } = Typography;

const format = (n) => `$${(n || 0).toLocaleString()}`;

const MonthSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMensual = async () => {
      try {
        const resumen = await getMonthSummary();
        setData(resumen);
        console.log('Esto me llega del mes:', resumen);
      } catch (err) {
        console.error('Error al cargar resumen mensual:', err);
        message.error('No se pudo cargar el resumen mensual');
      } finally {
        setLoading(false);
      }
    };

    fetchMensual();
  }, []);

  // Cálculo acumulado para el footer
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
    {
      title: 'Día',
      dataIndex: 'dia',
      key: 'dia',
    },
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
    <>
      <Header />
      <div style={{ padding: 32 }}>
        <Card title={<Title level={3}>Resumen Mensual</Title>}>
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
    </>
  );
};

export default MonthSummary;
