import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({rawdata}) => {
    const data = {
        labels: ['Paid contibutors', 'Unpaid contributors'],
        datasets: [
            {
                label: 'Contributors',
                data: rawdata,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ width: '600px', height: '400px', padding: '100px', }}>
            <Pie data={data} />;
        </div>
    )
};

export default PieChart;
