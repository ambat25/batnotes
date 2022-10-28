import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Note from "./Note";
import { auth } from "./config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

function App() {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      localStorage.setItem('batnotes_token', user.accessToken)
    };
  }, [user]);
  
  if (loading) return <div>Loading...</div>

  if (error) return <div>Error loading app</div>

  return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/note" element={<Note />} />
        </Routes>
      </Router>
  );
}
export default App;
