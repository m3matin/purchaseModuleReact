import axios from "axios";
import React, { useState, useEffect } from "react";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios("http://localhost/purchasemoduleAPI/getAllOrders.php")
      .then((response) => {
        const data = response.data;

        if (data.status) {
          setOrders(data.orders);
        } else {
          setError(data.message);
        }
      })
      .catch((err) => {
        setError("Error fetching data");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>All Orders</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Supplier Name</th>
            <th>Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.supplier_name}</td>
                <td>{order.grand_total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No orders available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllOrders;
