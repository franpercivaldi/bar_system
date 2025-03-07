import { Table, Card, Typography } from 'antd';

const { Title } = Typography;

const SalesSummary = ({ salesData }) => {
  const columns = [
    { title: 'Concepto', dataIndex: 'concept', key: 'concept' },
    {
      title: 'Turno Mañana',
      dataIndex: 'morning',
      key: 'morning',
      align: 'right',
      render: (value) => value.toLocaleString(),
    },
    {
      title: 'Turno Noche',
      dataIndex: 'night',
      key: 'night',
      align: 'right',
      render: (value) => value.toLocaleString(),
    },
  ];

  const dataSource = [
    { key: '1', concept: 'Venta Total', morning: salesData.morning.totalSales, night: salesData.night.totalSales },
    { key: '2', concept: 'Tarjetas', morning: salesData.morning.cards, night: salesData.night.cards },
    { key: '3', concept: 'MP / Transfer', morning: salesData.morning.mpTransfer, night: salesData.night.mpTransfer },
    { key: '4', concept: 'Venta Total Tarjetas', morning: salesData.morning.totalCards, night: salesData.night.totalCards },
    { key: '5', concept: 'Venta Efectivo', morning: salesData.morning.cashSales, night: salesData.night.cashSales },
    { key: '6', concept: 'Gastos', morning: salesData.morning.expenses, night: salesData.night.expenses },
    { key: '7', concept: 'Total Efectivo Neto', morning: salesData.morning.netCash, night: salesData.night.netCash },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: 'auto' }}>
      <Card title="Resumen de Ventas" bordered={false} style={{ width: '100%' }}>
        <Table columns={columns} dataSource={dataSource} pagination={false} />

        <Card bordered={false} style={{ marginTop: '24px', textAlign: 'right' }}>
          <Title level={3}>Venta Total Día: {salesData.totalDaySales.toLocaleString()} $</Title>
          <Title level={3}>Venta Total Tarjetas: {salesData.totalDayCards.toLocaleString()} $</Title>
        </Card>
      </Card>
    </div>
  );
};

export default SalesSummary;
