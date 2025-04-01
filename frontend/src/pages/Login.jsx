import { Alert, Row, Col, Card, Form, Input, Button, Typography } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from "react-router-dom";
import {loginBar} from '../api/auth';
import * as Yup from 'yup';
import {useState} from 'react';


const { Title } = Typography;
const barImage = '../assets/barMarias.jpeg';

function Login() {

  // Hook para redireccionar a otras páginas
  const navigate = useNavigate();

  // Estado local para mostrar mensajes de error
  const [error, setError] = useState(null);

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required("Este campo es obligatorio"),
    password: Yup.string()
      .min(3, "La contraseña debe tener al menos 8 caracteres")
      .required("Este campo es obligatorio"),
  });

  return (
    <Row 
      gutter={16} 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        overflow: 'hidden', 
        margin: 0, 
        backgroundColor: '#1e1e1e' 
      }}
    >
      {/* Columna izquierda con imagen */}
      <Col 
        span={12} 
        style={{
          backgroundImage: `url(${barImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
      </Col>

      {/* Columna derecha con el formulario */}
      <Col 
        span={12} 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center" 
        }}
      >
        <Card 
          style={{ 
            width: 400, 
            padding: "20px", 
            borderRadius: "12px", 
            backgroundColor: "#2c2c2c", 
            border: "1px solid #3a3a3a", 
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" 
          }}
        >
          <Title level={2} style={{ textAlign: "center", color: "#e0e0e0" }}>
            Iniciar Sesión
          </Title>

          {/* Mostrar mensaje de error */}
          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: "10px" }} />}

          {/* Formulario de inicio de sesión */}
                    
          <Formik
            initialValues={{ nombre: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setError(null); 
              loginBar(values.nombre, values.password)
                .then((response) => {
                  localStorage.setItem("token", response.token);
                  localStorage.setItem("barSeleccionado", response.bar.id);
                  navigate("/daily-records");
                })
                .catch((error) => {
                  console.error("Error en la petición:", error);
                  const msg = error.response?.data?.msg || "Ocurrió un error inesperado";
                  setError(msg);
                });
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {/* Campo de Email */}
                <Form.Item
                  label={<span style={{ color: "#e0e0e0" }}>Nombre Bar</span>}
                  validateStatus={errors.nombre ? "error" : ""}
                  help={errors.nombre && touched.nombre ? errors.nombre : ""}
                >
                  <Input
                    name="nombre"
                    type="nombre"
                    value={values.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ingresa nombre del bar"
                    style={{
                      backgroundColor: "#1e1e1e",
                      color: "#e0e0e0",
                      borderColor: "#3a3a3a",
                    }}
                  />
                </Form.Item>

                {/* Campo de Contraseña */}
                <Form.Item
                  label={<span style={{ color: "#e0e0e0" }}>Contraseña</span>}
                  validateStatus={errors.password && touched.password ? "error" : ""}
                  help={errors.password && touched.password ? errors.password : ""}
                >
                  <Input.Password
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ingresa tu contraseña"
                    style={{
                      backgroundColor: "#1e1e1e",
                      color: "#e0e0e0",
                      borderColor: "#3a3a3a",
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    style={{
                      backgroundColor: "#10a37f",
                      borderColor: "#10a37f",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  >
                    Ingresar
                  </Button>
                </Form.Item>
              </form>
            )}
          </Formik>
        </Card>
      </Col>
    </Row>
  );
}

export default Login;
