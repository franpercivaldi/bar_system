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

  // Actualizar el estado localmente al agregar una nueva mesa
  const handleAddMesa = (nuevaMesa) => {
    setMesas((prev) => [...prev, nuevaMesa]);
  };

  // Actualizar el estado localmente al editar una mesa
  const handleEditMesa = (mesaActualizada) => {
    setMesas((prev) =>
      prev.map((mesa) =>
        mesa.id === mesaActualizada.id ? { ...mesa, ...mesaActualizada } : mesa
      )
    );
  };

  // Actualizar el estado localmente al eliminar una mesa
  const handleDeleteMesa = (id) => {
    setMesas((prev) => prev.filter((mesa) => mesa.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#2c2c2c'}}>
      <Header />
      <Row gutter={16} style={{ height: '100vh', width: '100vw' }}>
        <Col span={14}>
          <Card title="Registro Diario">
            <InputNewMesa onAdd={handleAddMesa} />
            <TableDaily 
              data={mesas} 
              loading={loading} 
              onEdit={handleEditMesa} 
              onDelete={handleDeleteMesa} 
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Gastos y vales">
            <TableExpenses />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Daily;
