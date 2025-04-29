// src/components/TableVales.js
import { useEffect, useState } from 'react';
import {
  Table,
  Select,
  InputNumber,
  Button,
  Card,
  message,
  Spin,
  Modal,
  Input
} from 'antd';
import { getEmployees, addEmployee } from '../api/employees';
import { getVales, addVale } from '../api/vales';

const { Option } = Select;

const TableVales = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [vales, setVales] = useState([]);
  const [newVale, setNewVale] = useState({ empleadoId: null, monto: 0 });

  // estados para modal de nuevo empleado
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [addingEmployee, setAddingEmployee] = useState(false);

  // 1) Traer lista de empleados
  useEffect(() => {
    (async () => {
      try {
        const resp = await getEmployees();
        setEmployees(resp.data);
      } catch (err) {
        console.error(err);
        message.error('No se pudieron cargar los empleados');
      }
    })();
  }, []);

  // 2) Traer vales
  useEffect(() => {
    (async () => {
      try {
        const resp = await getVales();
        setVales(
          resp.data.map(v => ({
            key: v.id,
            empleado: v.empleado.nombre,
            monto: parseFloat(v.monto),
            fecha: new Date(v.fecha).toLocaleString()
          }))
        );
      } catch (err) {
        console.error(err);
        message.error('No se pudieron cargar los vales');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (value, field) => {
    setNewVale(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = value => {
    if (value === 'add') {
      // abrir modal para crear empleado
      setIsModalVisible(true);
    } else {
      setNewVale(prev => ({ ...prev, empleadoId: value }));
    }
  };

  const handleAddVale = async () => {
    if (!newVale.empleadoId || newVale.monto <= 0) {
      message.warning('Elegí un empleado y un monto válido');
      return;
    }
    try {
      const resp = await addVale({
        empleado_id: newVale.empleadoId,
        monto: newVale.monto
      });
      const v = resp.data;
      setVales(prev => [
        ...prev,
        {
          key: v.id,
          empleado: v.empleado.nombre,
          monto: parseFloat(v.monto),
          fecha: new Date(v.fecha).toLocaleString()
        }
      ]);
      setNewVale({ empleadoId: null, monto: 0 });
      message.success('Vale agregado');
    } catch (err) {
      console.error(err);
      message.error('No se pudo guardar el vale');
    }
  };

  const handleModalOk = async () => {
    if (!newEmployeeName.trim()) {
      message.warning('Ingresá un nombre válido');
      return;
    }
    setAddingEmployee(true);
    try {
      const resp = await addEmployee({ nombre: newEmployeeName.trim() });
      const emp = resp.data;
      // actualizar lista de empleados
      setEmployees(prev => [...prev, emp]);
      // seleccionar el empleado recién creado
      setNewVale(prev => ({ ...prev, empleadoId: emp.id }));
      setIsModalVisible(false);
      setNewEmployeeName('');
      message.success('Empleado agregado');
    } catch (err) {
      console.error(err);
      message.error('No se pudo crear el empleado');
    } finally {
      setAddingEmployee(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setNewEmployeeName('');
    // opcional: limpiar selección si se había puesto "add"
    setNewVale(prev => ({ ...prev, empleadoId: null }));
  };

  const totalVales = vales.reduce((sum, v) => sum + v.monto, 0);

  const columns = [
    { title: 'Empleado', dataIndex: 'empleado', key: 'empleado' },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: m => `$${m.toFixed(2)}`
    },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' }
  ];

  return (
    <Card title="Vales" style={{ marginTop: 16 }}>
      {loading ? (
        <Spin />
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <Select
              placeholder="Empleado"
              style={{ flex: 1 }}
              value={newVale.empleadoId}
              onChange={handleSelectChange}
              allowClear
            >
              {employees.map(e => (
                <Option key={e.id} value={e.id}>
                  {e.nombre}
                </Option>
              ))}
              <Option key="add" value="add">
                + Agregar empleado
              </Option>
            </Select>
            <InputNumber
              placeholder="Monto"
              min={0}
              step={0.01}
              value={newVale.monto}
              onChange={val => handleChange(val, 'monto')}
            />
            <Button type="primary" onClick={handleAddVale}>
              Agregar
            </Button>
          </div>

          <Table columns={columns} dataSource={vales} pagination={false} scroll={{ y: 300 }} />

          <div
            style={{
              marginTop: 16,
              textAlign: 'right',
              fontSize: 16,
              fontWeight: 'bold'
            }}
          >
            TOTAL VALES: ${totalVales.toFixed(2)}
          </div>

          {/* Modal para nuevo empleado */}
          <Modal
            title="Agregar nuevo empleado"
            visible={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            confirmLoading={addingEmployee}
            okText="Crear"
            cancelText="Cancelar"
          >
            <Input
              placeholder="Nombre del empleado"
              value={newEmployeeName}
              onChange={e => setNewEmployeeName(e.target.value)}
              onPressEnter={handleModalOk}
            />
          </Modal>
        </>
      )}
    </Card>
  );
};

export default TableVales;
