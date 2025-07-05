import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart({ data }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            if (context && context.length > 0) {
              return context[0].label || '';
            }
            return '';
          },
          label: function(context) {
            const value = context.parsed;
            return `Price: ₹${value.toLocaleString()}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#fff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#fff',
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    cutout: '60%',
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 250, minWidth: 250 }}>
      <Doughnut data={data} options={options} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}