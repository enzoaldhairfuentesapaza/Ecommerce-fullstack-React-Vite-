import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OrderPage from "./pages/OrderDetail";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order/:orderId" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;