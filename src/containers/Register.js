import React, { useEffect, useState } from "react";
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword } from "../config/firebase";
import { Button, Input, Form } from 'antd';

function Register() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = ({ name, email, password }) => {
    setLoading(true)
    registerWithEmailAndPassword(name, email, password)
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (user) navigate("/note")
  }, [user, navigate]);
  return (
    <div className="register">
      <div className="register__container">
        <Form
          className="login-form"
          name="register"
          labelCol={{ span: 24 }}
          onFinish={handleRegister}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            style={{ margin: '0px' }}
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name"/>
          </Form.Item>
          <Form.Item
            name="email"
            style={{ margin: '0px' }}
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email"/>
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
            Register
          </Button>
        </Form.Item>
        </Form>
        <div>
          Already have an account? <Link to="/">Login</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Register;
