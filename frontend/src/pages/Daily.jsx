import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'antd';
import Header from '../components/Header';
import InputNewMesa from '../components/InputNewMesa';
import TableDaily from '../components/TableDaily';
import TableExpenses from '../components/TableExpenses';
import { getSales } from '../api/sales';

function Daily() {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialCaja = 1300;

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const result = await getSales();
        setMesas(result.data);
      } catch (error) {
        console.error("Error fetching mesas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMesas();
  }, []);

  // Cuando se agregue una nueva mesa desde InputNewMesa, la sumamos al array
  const handleAddMesa = (nuevaMesa) => {
    setMesas((prev) => [...prev, nuevaMesa]);
  };

  return (
    <>
      <Header />
      <Row gutter={16} style={{ height: '100vh', width: '100vw' }}>
        <Col span={14}>
          <Card title="Registro Diario">
            {/* Componente para agregar una nueva mesa */}
            <InputNewMesa onAdd={handleAddMesa} />
            {/* Tabla que muestra las mesas obtenidas del backend */}
            <TableDaily data={mesas} loading={loading} />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Gastos y vales">
            <TableExpenses initialCaja={initialCaja} />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Daily;
