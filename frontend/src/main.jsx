import { StrictMode } from 'react'
import App from './App.jsx'
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import { darkThemeTokens } from './theme/antdTheme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={darkThemeTokens}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
