// src/pages/Daily.js
import { useEffect, useState } from 'react';
import { Row, Col, Card, Alert } from 'antd';
import Header from '../components/Header';
import InputNewMesa from '../components/InputNewMesa';
import TableDaily from '../components/TableDaily';
import TableExpenses from '../components/TableExpenses';
import TableVales from '../components/TableVales';
import { getSales } from '../api/sales';

function Daily() {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  /** undefined = cargando; false = sin caja del día; true = caja ya registrada */
  const [cajaDelDiaLista, setCajaDelDiaLista] = useState(undefined);

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const result = await getSales();
        setMesas(result.data);
      } catch (error) {
        console.error('Error fetching mesas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMesas();
  }, []);

  const handleAddMesa = nuevaMesa => {
    setMesas(prev => [...prev, nuevaMesa]);
  };

  const handleEditMesa = mesaActualizada => {
    setMesas(prev =>
      prev.map(m => (m.id === mesaActualizada.id ? { ...m, ...mesaActualizada } : m))
    );
  };

  const handleDeleteMesa = id => {
    setMesas(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#2c2c2c' }}>
      <Header />
      <Row gutter={16} style={{ height: '100vh', width: '100vw' }}>
        {/* Registro diario en la izquierda */}
        <Col span={14}>
          <Card title="Registro Diario" style={{ height: '100%' }}>
            {cajaDelDiaLista === false && (
              <Alert
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
                message="Primero registrá la caja inicial del día"
                description="En el panel Gastos (columna derecha), ingresá el monto de la caja al abrir y tocá Confirmar. Después vas a poder cargar mesas y el resto del día."
              />
            )}
            <InputNewMesa
              onAdd={handleAddMesa}
              cajaDelDiaLista={cajaDelDiaLista}
            />
            <TableDaily
              data={mesas}
              loading={loading}
              onEdit={handleEditMesa}
              onDelete={handleDeleteMesa}
            />
          </Card>
        </Col>

        {/* Gastos y Vales en la derecha con scroll conjunto */}
        <Col
          span={10}
          style={{
            height: '100vh',
            overflowY: 'auto',
            padding: 16,
          }}
        >
          <Card title="Gastos" style={{ marginBottom: 16 }}>
            <TableExpenses onCajaEstadoChange={setCajaDelDiaLista} />
          </Card>

          <Card title="Vales">
            <TableVales />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Daily;
