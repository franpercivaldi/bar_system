import { Alert, Row, Col, Card, Form, Input, Button, Typography } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from "react-router-dom";
import { loginBar, registerBar } from '../api/auth';
import * as Yup from 'yup';
import { useState } from 'react';


const { Title } = Typography;
const barImage = '../assets/barMarias.jpeg';

function Login() {

  // Hook para redireccionar a otras páginas
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [mode, setMode] = useState("login");

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required("Este campo es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
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
          <div style={{ marginBottom: 16 }}>
            <Button.Group style={{ width: "100%", display: "flex" }}>
              <Button
                type={mode === "login" ? "primary" : "default"}
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                style={{
                  flex: 1,
                  height: 40,
                  fontWeight: "bold",
                  ...(mode === "login"
                    ? { backgroundColor: "#10a37f", borderColor: "#10a37f", color: "#fff" }
                    : {
                        backgroundColor: "#3a3a3a",
                        borderColor: "#3a3a3a",
                        color: "#e0e0e0",
                      }),
                }}
              >
                Ingresar
              </Button>
              <Button
                type={mode === "register" ? "primary" : "default"}
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                style={{
                  flex: 1,
                  height: 40,
                  fontWeight: "bold",
                  ...(mode === "register"
                    ? { backgroundColor: "#10a37f", borderColor: "#10a37f", color: "#fff" }
                    : {
                        backgroundColor: "#3a3a3a",
                        borderColor: "#3a3a3a",
                        color: "#e0e0e0",
                      }),
                }}
              >
                Registrarse
              </Button>
            </Button.Group>
          </div>

          <Title level={2} style={{ textAlign: "center", color: "#e0e0e0", marginTop: 0 }}>
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </Title>

          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: "10px" }} />}

          <Formik
            key={mode}
            initialValues={{ nombre: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setError(null);
              const goDaily = (response) => {
                localStorage.setItem("token", response.token);
                localStorage.setItem("barSeleccionado", response.bar.id);
                navigate("/daily-records");
              };
              if (mode === "login") {
                loginBar(values.nombre, values.password)
                  .then(goDaily)
                  .catch((err) => {
                    console.error("Error en la petición:", err);
                    const msg = err.response?.data?.msg || err.response?.data?.error || "Ocurrió un error inesperado";
                    setError(msg);
                  });
              } else {
                registerBar(values.nombre, values.password)
                  .then(() => loginBar(values.nombre, values.password))
                  .then(goDaily)
                  .catch((err) => {
                    console.error("Error en la petición:", err);
                    const msg =
                      err.response?.data?.msg || err.response?.data?.error || "Ocurrió un error inesperado";
                    setError(msg);
                  });
              }
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
                    {mode === "login" ? "Ingresar" : "Crear cuenta"}
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
