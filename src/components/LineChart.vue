<template>
  <LineChartGenerator
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
)

export default {
  name: 'LineChart',
  components: {
    LineChartGenerator
  },
  props: {
    chartId: {
      type: String,
      default: 'line-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 650
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    },
    labels: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chartData: {
        labels: this.labels,
        datasets: [
          {
            label: this.label,
            backgroundColor: '#000000',
            data: this.data,
            fill: false,
            borderColor: "#000000",
            pointRadius: 5,
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          xAxes: {
            position: "top",
            suggestedMin: 1,
            suggestedMax: 10,
            stepSize: 1,
            ticks: {
              precision : 0,
              min: 1,
              max: 10,
              stepSize: 1,
              beginAtZero: true
            }
          }
        }
      }
    }
  }
}
</script>
