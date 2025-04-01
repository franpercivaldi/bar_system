import { useEffect, useState } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Button,
  Card,
  message,
  Spin,
} from 'antd';
import { addComment, getComments } from '../api/comments'; // ✅ Agregado acá
import { getCajaInicial, saveCajaInicial } from '../api/caja';

const TableExpenses = () => {
  const [loadingCaja, setLoadingCaja] = useState(true);
  const [cajaInicial, setCajaInicial] = useState(null);
  const [inputCaja, setInputCaja] = useState(0);

  const [data, setData] = useState([]);
  const [newExpense, setNewExpense] = useState({ descripcion: '', monto: 0 });

  // Obtener los comentarios del día
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const comentarios = await getComments();
        const formateados = comentarios.map((c) => ({
          key: c.id,
          descripcion: c.comentario,
          monto: parseFloat(c.monto),
        }));
        setData(formateados);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };

    fetchComentarios();
  }, []);

  // Obtener la caja inicial al cargar
  useEffect(() => {
    const fetchCaja = async () => {
      try {
        const caja = await getCajaInicial();
        if (caja) {
          setCajaInicial(parseFloat(caja.monto));
        }
      } catch (error) {
        console.log('No hay caja registrada aún');
      } finally {
        setLoadingCaja(false);
      }
    };

    fetchCaja();
  }, []);

  const handleChange = (value, field) => {
    setNewExpense((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmarCaja = async () => {
    try {
      if (inputCaja <= 0) {
        message.warning('Ingresá un monto válido');
        return;
      }

      const caja = await saveCajaInicial(inputCaja);
      setCajaInicial(parseFloat(caja.monto));
      message.success('Caja inicial guardada');
    } catch (error) {
      console.error('Error al guardar caja:', error);
      message.error('No se pudo guardar la caja');
    }
  };

  const handleAddExpense = async () => {
    if (!cajaInicial) {
      message.warning('Debés ingresar la caja inicial primero');
      return;
    }

    try {
      if (!newExpense.descripcion || newExpense.monto <= 0) {
        message.warning('Completá la descripción y un monto válido');
        return;
      }

      const nuevo = await addComment({
        comentario: newExpense.descripcion,
        monto: newExpense.monto,
      });

      setData((prev) => [
        ...prev,
        {
          key: nuevo.id,
          descripcion: nuevo.comentario,
          monto: parseFloat(nuevo.monto),
        },
      ]);

      setNewExpense({ descripcion: '', monto: 0 });
      message.success('Gasto agregado');
    } catch (error) {
      console.error('Error al guardar gasto:', error);
      message.error('No se pudo guardar el gasto');
    }
  };

  const totalGastos = data.reduce((sum, item) => sum + item.monto, 0);
  const saldoFinal = (cajaInicial || 0) - totalGastos;

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
    <Card
      title={
        cajaInicial !== null
          ? `Caja Inicial: $${cajaInicial.toFixed(2)}`
          : 'Ingresá la Caja Inicial'
      }
      style={{ marginTop: 16 }}
    >
      {loadingCaja ? (
        <Spin />
      ) : cajaInicial === null ? (
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <InputNumber
            placeholder="Caja Inicial"
            min={0}
            value={inputCaja}
            onChange={setInputCaja}
          />
          <Button type="primary" onClick={handleConfirmarCaja}>
            Confirmar
          </Button>
        </div>
      ) : (
        <>
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
            <Button type="primary" onClick={handleAddExpense}>
              Agregar
            </Button>
          </div>

          <Table columns={columns} dataSource={data} pagination={false} />

          <div
            style={{
              marginTop: 16,
              textAlign: 'right',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            TOTAL GASTOS: ${totalGastos.toFixed(2)} <br />
            SALDO FINAL: ${saldoFinal.toFixed(2)}
          </div>
        </>
      )}
    </Card>
  );
};

export default TableExpenses;
