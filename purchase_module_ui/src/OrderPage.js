import React, { useState, useEffect, use } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  FormSelect,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const fetchSuppliers = async () => {
    await axios
      .get("http://localhost/purchasemoduleAPI/getAllSupperliers.php")
      .then((response) => {
        if (response.data.status) {
          setSuppliers(response.data.suppliers);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchProducts = async () => {
    await axios
      .get("http://localhost/purchasemoduleAPI/getAllProducts.php")
      .then((response) => {
        if (response.data.status) {
          setProducts(response.data.products);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
  };

  const handleProductSelect = (e) => {
    const selectedProductId = e.target.value;
    const product = products.find((p) => p.id === selectedProductId);

    if (product && !selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([
        ...selectedProducts,
        { ...product, quantity: 1, total: parseFloat(product.price) * 1.18 },
      ]);
    }
  };

  const handleQuantityChange = (id, quantity) => {
    const updatedProducts = selectedProducts.map((product) => {
      if (product.id === id) {
        const newTotal = parseFloat(product.price) * quantity * 1.18;
        return { ...product, quantity, total: newTotal };
      }
      return product;
    });

    setSelectedProducts(updatedProducts);
  };

  useEffect(() => {
    const total = selectedProducts.reduce(
      (sum, product) => sum + product.total,
      0
    );
    setGrandTotal(total);
  }, [selectedProducts]);

  console.log("check selectedProducts", selectedProducts);
  console.log("check grandTotal", grandTotal);
  console.log("check selectedSupplier", selectedSupplier);
  console.log("check products", products);

  const placeOrder = async () => {
    if (selectedProducts.length > 0) {
      let values = {
        products: selectedProducts,
        supplier_id: selectedSupplier,
      };

      await axios
        .post(
          "http://localhost/purchasemoduleAPI/calculateProducts.php",
          values
        )
        .then((response) => {
          console.log("response", response.data);
          if (response.data.status) {
            alert(response.data.message);
            setGrandTotal(0);
            setSelectedProducts([]);
            setSelectedSupplier("");
            navigate("/allOrders");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleGotoAllOrders = () => {
    navigate("/allOrders");
  };

  return (
    <>
      <Container className="mt-5">
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>Suppliers</Form.Label>
            <FormSelect
              value={selectedSupplier}
              onChange={handleSupplierChange}
            >
              <option value="">Select Supplier</option>
              {suppliers?.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </FormSelect>
          </Col>

          <Col md={4}>
            <Form.Label>Products</Form.Label>
            <FormSelect onChange={handleProductSelect}>
              <option value="">Select Product</option>
              {products?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </FormSelect>
          </Col>
        </Row>

        <Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Code</th>
                <th>Product Name</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Cost Price</th>
                <th>GST (18%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.size}</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={product.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(
                          product.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </td>
                  <td>{parseFloat(product.price).toFixed(2)}</td>
                  <td>
                    {parseFloat(product.quantity) > 0 &&
                    parseFloat(product.quantity)
                      ? (
                          (parseFloat(product.quantity) *
                            parseFloat(product.price) *
                            parseFloat(product.gst_rate)) /
                          100
                        ).toFixed(2)
                      : "0.00"}
                  </td>

                  <td>{product.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6" className="text-end fw-bold">
                  Grand Total
                </td>
                <td className="fw-bold">{grandTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </Table>
        </Row>

        <Row className="mt-3">
          <Col md={12} className="text-end">
            <Button
              disabled={!selectedSupplier || selectedProducts.length === 0}
              onClick={placeOrder}
            >
              Submit Order
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={12} className="text-end">
            <Button info onClick={handleGotoAllOrders}>
              Goto All Orders
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrderPage;
