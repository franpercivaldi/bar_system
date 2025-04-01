import { Table, Tag } from 'antd';

const TableDaily = ({ data, loading }) => {
  const columns = [
    {
      title: 'Mesa',
      dataIndex: 'numero_mesa',
      key: 'numero_mesa',
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
    },
    {
      title: 'Tipo Pago',
      dataIndex: 'tipo_pago',
      key: 'tipo_pago',
      render: (tipo) => {
        if (tipo === 'Efectivo') {
          return <Tag color="green">{tipo}</Tag>;
        } else if (tipo === 'Mercado Pago') {
          return <Tag color="blue">{tipo}</Tag>;
        } else {
          return <Tag color="orange">{tipo}</Tag>;
        }
      },
    },
    {
      title: 'Propina',
      dataIndex: 'propina',
      key: 'propina',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"       // Cada registro tiene un "id" único
      pagination={false}
    />
  );
};

export default TableDaily;
