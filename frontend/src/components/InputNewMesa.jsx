import { Form, InputNumber, Select, Button, Card } from 'antd';
import { addSale } from '../api/sales';

const { Option } = Select;

const InputNewMesa = ({ onAdd }) => {
  const [form] = Form.useForm();

  // Al enviar el form, llamamos al endpoint y agregamos la mesa
  const onFinish = async (values) => {
    try {
      const { numero_mesa, monto, tipo_pago, propina } = values;
      const nuevaMesa = await addSale(numero_mesa, monto, tipo_pago, propina);
      onAdd?.(nuevaMesa);     // Notifica al padre
      form.resetFields();     // Limpia el formulario
    } catch (error) {
      console.error('Error al agregar nueva mesa:', error);
    }
  };

  return (
    <Card title="Agregar Nueva Mesa" style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item
          name="numero_mesa"
          rules={[{ required: true, message: 'Ingresa número de mesa' }]}
        >
          <InputNumber placeholder="Mesa" min={1} />
        </Form.Item>

        <Form.Item
          name="monto"
          rules={[{ required: true, message: 'Ingresa el monto' }]}
        >
          <InputNumber placeholder="Monto" min={0} />
        </Form.Item>

        <Form.Item name="tipo_pago" initialValue="Efectivo">
          <Select style={{ width: 120 }}>
            <Option value="Efectivo">Efectivo</Option>
            <Option value="Mercado Pago">Mercado Pago</Option>
            <Option value="Transferencia">Transferencia</Option>
          </Select>
        </Form.Item>

        <Form.Item name="propina" initialValue={0}>
          <InputNumber placeholder="Propina" min={0} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Agregar Mesa
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default InputNewMesa;
