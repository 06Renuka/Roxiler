import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import TransactionsStatistics from './components/TransactionsStatistics';
import TransactionsBarChart from './components/TransactionsBarChart';
 import TransactionsPieChart from './components/TransactionsPieChart';

function App() {
  const [month, setMonth] = useState('03'); // Default month is March

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <div className="App">
      <h1 style={{textAlign:'center'}}>Transactions Dashboard</h1>
      <div style={{ textAlign: 'center' }}>
        <label>Select Month: </label>
        <select value={month} onChange={handleMonthChange}>
          {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>
      <TransactionsTable month={month} />
      <TransactionsStatistics month={month} />
      <TransactionsBarChart month={month} />  
    
        <TransactionsPieChart month={month} /> 
    </div>
  );
}

export default App;
