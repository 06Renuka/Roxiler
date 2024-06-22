

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';

const BarChart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 400,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    dataLabels: {
                        position: 'top',
                    },
                },
            },
            dataLabels: {
                enabled: true,
                offsetY: -20,
                formatter: function (val) {
                    return val;
                },
                style: {
                    colors: ['#fff'],
                },
            },
            xaxis: {
                categories: [],
                 title: {
                     text: ' Range',
                 },
            },
            yaxis: {
                title: {
                    text: ' Count',
                },
                tickAmount: 4,
            },
            // title: {
            //     text: 'No of products per price range',
            //     align: 'center',
            // },
            tooltip: {
                enabled: false,
            },
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/bar-chart');
                console.log(response)
                const data = response.data;

                if (Array.isArray(data)) {
                    const labels = data.map(item => item.range);
                    const values = data.map(item => item.count);

                    setChartData({
                        series: [
                            {
                                name: 'No of products per price range',
                                data: values,
                            },
                        ],
                        options: {
                            ...chartData.options, // Preserve existing options
                            xaxis: {
                                ...chartData.options.xaxis,
                                categories: labels,
                            },
                        },
                    });
                } else {
                    console.error('Unexpected API response format:', data);
                }
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, []); 

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0px' }}>
        <div style={{ maxWidth: '900px', maxHeight: '500px', width:"100%" }}>
            <Chart options={chartData.options} series={chartData.series} type="bar" height={400} />
        </div>
    </div>
    
    );
};

export default BarChart;
