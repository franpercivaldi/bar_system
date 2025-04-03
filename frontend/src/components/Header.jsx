import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      {/* Logo */}
      <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
        LOGO
      </div>

      {/* Menú de navegación */}
      <Menu theme="dark" mode="horizontal" style={{ flex: 1, justifyContent: 'center' }}>
        <Menu.Item key="1">
          <Link to="/daily-records">Mesas</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/salesDay-summary">Resumen Diario</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/">Resumen Mensual</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;
