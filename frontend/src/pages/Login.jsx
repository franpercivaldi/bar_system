import { Row, Col, Card, Form, Input, Button, Typography } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';


const { Title } = Typography;
const barImage = '../assets/barMarias.jpeg';

function Login() {
  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Campo requerido"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Campo requerido"),
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
          
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Datos enviados:", values);
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <Form layout="vertical" onFinish={handleSubmit}>
                {/* Campo de Email */}
                <Form.Item 
                  label={<span style={{ color: "#e0e0e0" }}>Correo Electrónico</span>} 
                  validateStatus={errors.email && touched.email ? "error" : ""} 
                  help={errors.email && touched.email ? errors.email : ""}
                >
                  <Input 
                    name="email" 
                    type="email" 
                    value={values.email} 
                    onChange={handleChange} 
                    onBlur={handleBlur} 
                    placeholder="Ingresa tu email"
                    style={{ 
                      backgroundColor: "#1e1e1e", 
                      color: "#e0e0e0", 
                      borderColor: "#3a3a3a" 
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
                      borderColor: "#3a3a3a" 
                    }} 
                  />
                </Form.Item>

                {/* Botón de Iniciar Sesión */}
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    style={{
                      backgroundColor: "#10a37f", 
                      borderColor: "#10a37f",
                      color: "#ffffff",
                      fontWeight: "bold"
                    }}
                  >
                    Ingresar
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Formik>
        </Card>
      </Col>
    </Row>
  );
}

export default Login;
