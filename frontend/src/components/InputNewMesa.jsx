import { useState } from 'react';
import { Input, InputNumber, Select, Button, Form, Card } from 'antd';

const { Option } = Select;

const InputNewMesa = ({ onAdd }) => {
  const [form] = Form.useForm();
  const [newMesa, setNewMesa] = useState({
    mesa: '',
    monto: 0,
    tipoPago: 'Efectivo',
    propina: 0,
  });

  const handleChange = (value, field) => {
    setNewMesa((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // TODO: hacer endpoint para agregar la mesa
    console.log('newMesa', newMesa);
  };

  return (
    <Card title="Agregar Nueva Mesa" style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline" onFinish={handleSubmit}>
        <Form.Item>
          <Input
            placeholder="Mesa"
            value={newMesa.mesa}
            onChange={(e) => handleChange(e.target.value, 'mesa')}
          />
        </Form.Item>
        <Form.Item>
          <InputNumber
            placeholder="Monto"
            min={0}
            value={newMesa.monto}
            onChange={(value) => handleChange(value, 'monto')}
          />
        </Form.Item>
        <Form.Item>
          <Select value={newMesa.tipoPago} onChange={(value) => handleChange(value, 'tipoPago')}>
            <Option value="Efectivo">Efectivo</Option>
            <Option value="Mercado Pago">Mercado Pago</Option>
            <Option value="Transferencia">Transferencia</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <InputNumber
            placeholder="Propina"
            min={0}
            value={newMesa.propina}
            onChange={(value) => handleChange(value, 'propina')}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Agregar Mesa</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default InputNewMesa;
