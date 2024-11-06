import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppRouter } from "./routes";

function App() {

  return (
    <>
      <AppRouter />
      <ToastContainer position="top-center" autoClose={2000} style={{ backgroundColor: "black", color: "white" }} />
    </>
  );
}

export default App;
