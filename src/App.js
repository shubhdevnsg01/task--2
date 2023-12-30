import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedFields, setSelectedFields] = useState(['title', 'price']);

  useEffect(() => {
    // Fetch JSON data from the API
    const apiURL = "https://s3.amazonaws.com/open-to-cors/assignment.json";

    axios.get(apiURL)
      .then(response => {
        // Check if the request was successful (status code 200)
        if (response.status !== 200) {
          throw new Error(`Failed to fetch data. Status code: ${response.status}`);
        }
        return response.data;
      })
      .then(data => {
        // Convert the incoming data object into an array of products
        const productsArray = Object.values(data.products);

        // Sort products by descending popularity
        const sortedProducts = productsArray.sort((a, b) => b.popularity - a.popularity);

        // Update state with sorted products
        setProducts(sortedProducts);
      })
      .catch(error => {
        console.error(error.message);
      });
  }, []); // Empty dependency array ensures the effect runs once on component mount

  const handleFieldSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedFields(prevFields => {
      if (checked) {
        return [...prevFields, value];
      } else {
        return prevFields.filter(field => field !== value);
      }
    });
  };

  return (
    <div>
      <h1>Product List</h1>
      <Row>
        <Col sm={6}>
          <h3>Available Fields</h3>
          <Form>
            {['title', 'price', 'subcategory', 'popularity'].map(field => (
              <Form.Check
                key={field}
                type="checkbox"
                id={field}
                label={field}
                value={field}
                checked={selectedFields.includes(field)}
                onChange={handleFieldSelection}
              />
            ))}
          </Form>
        </Col>
        <Col sm={6}>
          <h3>Fields to be Displayed</h3>
          <ul>
            {selectedFields.map(field => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            {selectedFields.map(field => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.title}>
              {selectedFields.map(field => (
                <td key={field}>{product[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductList;
