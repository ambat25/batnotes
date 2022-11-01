import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Reset from "./containers/Reset";
import Note from "./containers/Note";
import { ToastContainer } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase";

function App() {
  const [user, loading, error] = useAuthState(auth);
  
  if (loading) return <div>Loading...</div>

  if (error) return <div>Error loading app</div>

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/note" element={<Note user={user} />} />
        </Routes>
      </Router>
      <ToastContainer
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable={false}
        theme="light"
        style={{
          width: 'auto'
        }}
      />
    </>
  );
}
export default App;
