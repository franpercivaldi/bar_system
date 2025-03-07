import { Row, Col, Card } from 'antd';
import TableDaily from '../components/TableDaily';
import InputNewMesa from '../components/InputNewMesa';
import TableExpenses from '../components/TableExpenses';
import Header from '../components/Header';

function Daily() {
  const initialData = [
    { key: '1', mesa: 'Mesa 1', monto: 250.50, tipoPago: 'Efectivo', propina: 20.00 },
    { key: '2', mesa: 'Mesa 2', monto: 320.75, tipoPago: 'Mercado Pago', propina: 15.50 },
    { key: '3', mesa: 'Mesa 3', monto: 150.00, tipoPago: 'Transferencia', propina: 10.00 },
  ];

  const initialCaja = 1300;

  return (
    <>
      <Header />
      <Row gutter={16} style={{ height: '100vh', width: '100vw'}}>
        {/* Columna izquierda: Tabla */}
        <Col span={12}>
          <Card title="Registro Diario">
            {/* Input para agregar una fila de la tabla */}
            <InputNewMesa />
            {/* Tabla de las mesas */}
            <TableDaily initialData={initialData} />
          </Card>
        </Col>

        {/* Columna derecha: Espacio reservado para otro componente */}
        <Col span={12}>
          <Card title="Gastos y vales">
            {/* Aquí puedes agregar tu otro componente */}
            <TableExpenses initialCaja={initialCaja} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Daily;
