import { Table, Input, InputNumber, Button, Card } from 'antd';
import { useState } from 'react';

const TableExpenses = ({ initialCaja }) => {
  const [data, setData] = useState([]);
  const [newExpense, setNewExpense] = useState({ descripcion: '', monto: 0 });

  const handleChange = (value, field) => {
    setNewExpense((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddExpense = () => {
    // TODO: hacer endpoint para agregar el gasto
    console.log('newExpense', newExpense);
  };

  const totalGastos = data.reduce((sum, item) => sum + item.monto, 0);
  const saldoFinal = initialCaja - totalGastos;

  const columns = [
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: '$',
      dataIndex: 'monto',
      key: 'monto',
      render: (text) => `$${text.toFixed(2)}`,
    },
  ];

  return (
    <Card title={`Caja Inicial: $${initialCaja.toFixed(2)}`} style={{ marginTop: 16 }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input
          placeholder="Descripción"
          value={newExpense.descripcion}
          onChange={(e) => handleChange(e.target.value, 'descripcion')}
        />
        <InputNumber
          placeholder="Monto"
          min={0}
          step={0.01}
          value={newExpense.monto}
          onChange={(value) => handleChange(value, 'monto')}
        />
        <Button type="primary" onClick={handleAddExpense}>Agregar</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="key" pagination={false} />
      <div style={{ marginTop: 16, textAlign: 'right', fontSize: 16, fontWeight: 'bold' }}>
        TOTAL GASTOS: ${totalGastos.toFixed(2)}<br />
        SALDO FINAL: ${saldoFinal.toFixed(2)}
      </div>
    </Card>
  );
};

export default TableExpenses;