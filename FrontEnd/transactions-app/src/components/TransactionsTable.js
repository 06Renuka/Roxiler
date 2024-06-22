import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "./design.css"
import Container from 'react-bootstrap/Container';

const TransactionsTable = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbId, setDbId] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/api/transactions', {
        //  params: { month, search, page },
         
      });
      
      console.log("hello in table", response.data);

      if (response.data) {
        setTransactions(response.data.transactions || []);
        setTotalPages(response.data.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [month, search, page]);

  // useEffect(() => {
  //   const fetchDataForTable = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/db/connect');
        
  //       setDbId(response.data.id);
        
  //       // You can set other data as well here
  //     } catch (error) {
  //       setError(error.response?.data?.error || 'Failed to connect to database');
  //     }
  //   };

  //   fetchDataForTable();
  // }, []);

  useEffect(() => {
    fetchTransactions();
  }, [month, page, search, fetchTransactions]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1); // Reset to the first page when a new search is made
  };
  const handlePerPageChange = (event) => {
    setPerPage(Number(event.target.value));
    setPage(1); // Reset to the first page when items per page change
  };
 

  return (

    <Container className="transactions-table" >
      <h2 style={{textAlign:'center'}}>Transactions Table</h2>
      <input
        type="text"
        placeholder="Search transactions"
        value={search}
        onChange={handleSearchChange}
      />
       {/* <select value={perPage} onChange={handlePerPageChange}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select> */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              {/* <th>Id</th> */}
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Date of Sale</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                {/* <td>{transaction.id}</td> */}
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? 'true' : 'false'}</td>
                <td>{transaction.dateOfSale}</td>
                <td><img src={transaction.image} alt={transaction.title} style={{ width: '50px' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination-container">
        <p>Page No: {page}</p>
        <div className="pagination">
          <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
            Next
          </button>
        </div>
        <p>Per page: {perPage}</p>
      </div>
      
    </Container>
  );
};

export default TransactionsTable;
