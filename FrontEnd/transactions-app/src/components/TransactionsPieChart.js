import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import Container from 'react-bootstrap/esm/Container';

const TransactionsPieChart = ({ month }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'pie',
      },
      labels: [],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  });

  const fetchChartData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pie-chart', {
        // params: { month }
      });
      console.log(response)

      setChartData({
        series: response.data.map(item => item.count),
        options: {
          ...chartData.options,
          labels: response.data.map(item => item._id),
        }
      });
    } catch (error) {
      console.error("Error fetching the pie chart data", error);
    }
  }, [month, chartData.options]);

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', margin: '24px 0px' }}>
    <div>
      <h2>Transactions Pie Chart</h2>
      <div style={{ maxWidth: '900px', maxHeight: '500px', width: '100%' }}>
        <Chart options={chartData.options} series={chartData.series} type="pie" width="500" />
      </div>
    </div>
  </Container>
  );
};

export default TransactionsPieChart;
