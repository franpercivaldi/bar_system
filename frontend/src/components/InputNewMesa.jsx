import { Form, InputNumber, Select, Button, Card, Row, Col } from 'antd';
import { addSale } from '../api/sales';

const { Option } = Select;

const InputNewMesa = ({ onAdd }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const { numero_mesa, monto, tipo_pago, propina } = values;
      const nuevaMesa = await addSale(numero_mesa, monto, tipo_pago, propina);
      onAdd?.(nuevaMesa);
      form.resetFields();
    } catch (error) {
      console.error('Error al agregar nueva mesa:', error);
    }
  };

  return (
    <Card title="Agregar Nueva Mesa" style={{ marginBottom: 16 }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={4}>
            <Form.Item
              name="numero_mesa"
              label="Mesa"
              rules={[{ required: true, message: 'Ingresa número de mesa' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="monto"
              label="Monto"
              rules={[{ required: true, message: 'Ingresa el monto' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="tipo_pago" label="Tipo de Pago" initialValue="Efectivo">
              <Select style={{ width: '100%' }}>
                <Option value="Efectivo">Efectivo</Option>
                <Option value="Mercado Pago">Mercado Pago</Option>
                <Option value="Tarjeta">Tarjeta</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="propina" label="Propina" initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={22} style={{ textAlign: 'right' }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Agregar Mesa
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default InputNewMesa;
