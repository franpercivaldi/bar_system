import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  const location = useLocation();

  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      {/* Logo */}
      <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
        LOGO
      </div>

      {/* Menú de navegación */}
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ flex: 1, justifyContent: 'center' }}
        selectedKeys={[location.pathname]} // Resalta el elemento seleccionado
      >
        <Menu.Item key="/daily-records">
          <Link to="/daily-records">Mesas</Link>
        </Menu.Item>
        <Menu.Item key="/salesDay-summary">
          <Link to="/salesDay-summary">Resumen Diario</Link>
        </Menu.Item>
        <Menu.Item key="/month-summary">
          <Link to="/month-summary">Resumen Mensual</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;
