import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../config/firebase";
import { Button, Input } from 'antd';

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/note")
  }, [user, navigate]);

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error loading app</div>
  return (
    <div className="reset">
      <div className="reset__container">
        <Input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <br />
        <Button
          onClick={() => sendPasswordReset(email)}
        >
          Send password reset email
        </Button>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Reset;
