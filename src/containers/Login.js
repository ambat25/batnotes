import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Input, Form } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

function Login() {
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const handleRegister = ({ email, password }) => {
    setLoading(true)
    logInWithEmailAndPassword(email, password)
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) navigate("/note");
  }, [user, navigate]);
  return (
    <div className="login">
      <div className="login__container">
        <Form
          className="login-form"
          name="register"
          labelCol={{ span: 24 }}
          onFinish={handleRegister}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            style={{ margin: '0px' }}
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            style={{ margin: '0px' }}
            rules={[{ required: true, message: 'Please input your password!', min: 8 }]}
          >
            <Input type="password" prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} htmlType="submit" type="primary">
              Login
            </Button>
          </Form.Item>
        </Form>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Login;
