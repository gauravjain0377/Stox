import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        boxWidth: 12,
        padding: 10,
        font: {
          size: 12
        }
      }
    },
    title: {
      display: true,
      text: "Holdings",
      font: {
        size: 16,
        weight: 'bold'
      },
      padding: {
        top: 10,
        bottom: 20
      }
    },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        font: {
          size: 10
        },
        callback: function(value, index) {
          const label = this.getLabelForValue(value);
          // Truncate long labels - use shorter truncation for better visibility
          if (label.length > 12) {
            return label.substring(0, 12) + '...';
          }
          return label;
        }
      },
      grid: {
        display: false
      }
    },
    y: {
      ticks: {
        font: {
          size: 11
        }
      },
      grid: {
        color: 'rgba(0,0,0,0.05)'
      }
    }
  }
};

export function VerticalGraph({ data }) {
  return <Bar options={options} data={data} />;
}