import { Table, Tag, InputNumber, Select, Button, Popconfirm, message } from 'antd';
import { useState } from 'react';
import { EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { editSale, deleteSale } from '../api/sales';

const { Option } = Select;

/**
 * Muestra las ventas del día. Se invierte el orden de las filas para que
 * los registros más recientes aparezcan primero (orden descendente por `id`).
 */
const TableDaily = ({ data, loading, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  /** Orden descendente */
  const sortedData = Array.isArray(data) ? [...data].sort((a, b) => b.id - a.id) : [];

  const handleEditClick = (record) => {
    setEditingId(record.id);
    setEditedData(record);
  };

  const handleSaveClick = async () => {
    try {
      const updated = await editSale(editingId, editedData);
      message.success('Mesa actualizada correctamente');
      onEdit?.(updated); // Notifica al padre para actualizar el estado localmente
      setEditingId(null);
    } catch (error) {
      console.error('Error al editar la mesa:', error);
      message.error('Error al editar la mesa');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSale(id);
      message.success('Mesa eliminada correctamente');
      onDelete?.(id); // Notifica al padre para actualizar el estado localmente
    } catch (error) {
      console.error('Error al borrar la mesa:', error);
      message.error('Error al borrar la mesa');
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const columns = [
    {
      title: 'Mesa',
      dataIndex: 'numero_mesa',
      key: 'numero_mesa',
      render: (text, record) =>
        editingId === record.id ? (
          <InputNumber
            value={editedData.numero_mesa}
            min={1}
            onChange={(value) => handleFieldChange('numero_mesa', value)}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (text, record) =>
        editingId === record.id ? (
          <InputNumber
            value={editedData.monto}
            min={0}
            onChange={(value) => handleFieldChange('monto', value)}
          />
        ) : (
          `$${text}`
        ),
    },
    {
      title: 'Tipo Pago',
      dataIndex: 'tipo_pago',
      key: 'tipo_pago',
      render: (tipo, record) =>
        editingId === record.id ? (
          <Select
            value={editedData.tipo_pago}
            onChange={(value) => handleFieldChange('tipo_pago', value)}
            style={{ width: 130 }}
          >
            <Option value="Efectivo">Efectivo</Option>
            <Option value="Mercado Pago">Mercado Pago</Option>
            <Option value="Tarjeta">Tarjeta</Option>
          </Select>
        ) : (
          <Tag
            color={
              tipo === 'Efectivo'
                ? 'green'
                : tipo === 'Mercado Pago'
                ? 'blue'
                : 'orange'
            }
            style={{
              height: '30px',
              width: '100px',
              fontSize: '12px',
              padding: '2px 10px',
              borderRadius: '12px',
              fontWeight: '500',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {tipo}
          </Tag>
        ),
    },
    {
      title: 'Propina',
      dataIndex: 'propina',
      key: 'propina',
      render: (text, record) =>
        editingId === record.id ? (
          <InputNumber
            value={editedData.propina}
            min={0}
            step={0.01}
            onChange={(value) => handleFieldChange('propina', value)}
          />
        ) : (
          `$${text}`
        ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) =>
        editingId === record.id ? (
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveClick}>
            Guardar
          </Button>
        ) : (
          <>
            <Button
              icon={<EditOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => handleEditClick(record)}
            >
              Editar
            </Button>
            <Popconfirm
              title="¿Seguro que deseas eliminar esta mesa?"
              onConfirm={() => handleDelete(record.id)}
              okText="Sí"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </>
        ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={sortedData}
      loading={loading}
      rowKey="id"
      pagination={false}
      scroll={{ y: 300 }}
    />
  );
};

export default TableDaily;
