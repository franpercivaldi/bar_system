import { Table, Tag, InputNumber, Select, Button, Popconfirm } from 'antd';
import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const TableDaily = ({ initialData }) => {
  const [data, setData] = useState(initialData);

  const handleEdit = (value, key, field) => {
    // TODO: hacer endpoint para editar la mesa
    const newData = data.map((item) =>
      item.key === key ? { ...item, [field]: value } : item
    );
    setData(newData);
  };

  const handleDelete = (key) => {
    // TODO: hacer endpoint para eliminar la mesa
    setData(data.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: 'Mesa',  
      dataIndex: 'mesa',
      key: 'mesa',
      render: (text, record) => (
        <InputNumber
          value={text.replace('Mesa ', '')}
          min={1}
          onChange={(value) => handleEdit(`Mesa ${value}`, record.key, 'mesa')}
        />
      )
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          onChange={(value) => handleEdit(value, record.key, 'monto')}
        />
      ),
    },
    {
      title: 'Tipo Pago',
      dataIndex: 'tipoPago',
      key: 'tipoPago',
      render: (tipoPago, record) => (
        <Select
          value={tipoPago}
          onChange={(value) => handleEdit(value, record.key, 'tipoPago')}
        >
          <Option value="Efectivo"> <Tag color="green">Efectivo</Tag> </Option>
          <Option value="Mercado Pago"> <Tag color="blue">Mercado Pago</Tag> </Option>
          <Option value="Transferencia"> <Tag color="orange">Transferencia</Tag> </Option>
        </Select>
      ),
    },
    {
      title: 'Propina',
      dataIndex: 'propina',
      key: 'propina',
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          step={0.01}
          onChange={(value) => handleEdit(value, record.key, 'propina')}
        />
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Popconfirm
          title="¿Seguro que quieres eliminar esta fila?"
          onConfirm={() => handleDelete(record.key)}
          okText="Sí"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="key" pagination={false} />;
};

export default TableDaily;
