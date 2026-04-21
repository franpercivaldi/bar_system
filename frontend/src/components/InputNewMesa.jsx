import {
  Form,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Tooltip,
  message,
} from 'antd';
import { addSale } from '../api/sales';
import { getCajaInicial } from '../api/caja';

const { Option } = Select;

const InputNewMesa = ({ onAdd, cajaDelDiaLista }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (cajaDelDiaLista === false) {
      return;
    }

    if (cajaDelDiaLista === undefined) {
      const caja = await getCajaInicial();
      if (!caja) {
        message.error(
          'Primero registrá la caja inicial del día en el panel Gastos (columna derecha) y tocá Confirmar.'
        );
        return;
      }
    }

    try {
      const { numero_mesa, monto, tipo_pago, propina } = values;
      const nuevaMesa = await addSale(numero_mesa, monto, tipo_pago, propina);
      onAdd?.(nuevaMesa);
      form.resetFields();
    } catch (error) {
      console.error('Error al agregar nueva mesa:', error);
      const msg =
        error.response?.data?.mensaje ||
        error.response?.data?.msg ||
        'No se pudo agregar la mesa';
      message.error(msg);
    }
  };

  const mesaBloqueada = cajaDelDiaLista === false;

  return (
    <Card title="Agregar Nueva Mesa" style={{ marginBottom: 16 }}>
      {mesaBloqueada && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
          message="Caja inicial pendiente"
          description="No podés cargar mesas hasta registrar la caja del día en Gastos (derecha)."
        />
      )}
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={4}>
            <Form.Item
              name="numero_mesa"
              label="Mesa"
              rules={[{ required: true, message: 'Ingresa número de mesa' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} disabled={mesaBloqueada} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              name="monto"
              label="Monto"
              rules={[{ required: true, message: 'Ingresa el monto' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} disabled={mesaBloqueada} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="tipo_pago" label="Tipo de Pago" initialValue="Efectivo">
              <Select style={{ width: '100%' }} disabled={mesaBloqueada}>
                <Option value="Efectivo">Efectivo</Option>
                <Option value="Mercado Pago">Mercado Pago</Option>
                <Option value="Tarjeta">Tarjeta</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="propina" label="Propina" initialValue={0}>
              <InputNumber min={0} style={{ width: '100%' }} disabled={mesaBloqueada} />
            </Form.Item>
          </Col>

          <Col span={22} style={{ textAlign: 'right' }}>
            <Form.Item>
              <Tooltip
                title={
                  mesaBloqueada
                    ? 'Registrá primero la caja inicial en el panel Gastos (derecha)'
                    : null
                }
              >
                <Button type="primary" htmlType="submit" disabled={mesaBloqueada}>
                  Agregar Mesa
                </Button>
              </Tooltip>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default InputNewMesa;
