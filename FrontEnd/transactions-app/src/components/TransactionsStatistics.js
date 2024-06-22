import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/esm/Container';

const TransactionsStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({});

  const fetchStatistics = useCallback(async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/statistics`, {
        params: { month: selectedMonth }
      });
      setStatistics(data);
      console.log(data)
      
    } catch (error) {
      console.error(error);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth, fetchStatistics]);

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center', height: '100vh' }}>
      <h2>Statistics - {selectedMonth}</h2>
      <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </Container>
  );
};

export default TransactionsStatistics;
