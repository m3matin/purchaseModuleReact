import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import OrderPage from "./OrderPage";
import AllOrders from "./AllOrders";
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<OrderPage />} />
      <Route path="/palceOrder" element={<OrderPage />} />
      <Route path="/allOrders" element={<AllOrders />} />
    </Routes>
  </Router>
);

export default App;
