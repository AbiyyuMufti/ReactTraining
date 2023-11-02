import { ApexOptions } from "apexcharts";
import LineChart from "./LineChart";

const generateHourlyDataSeries = (rate?: number) => {
  let cur_date = new Date();
  const series = [];
  if (rate !== undefined) {
    for (let i = 0; i < 24; i++) {
      cur_date.setHours(i, 0, 0, 0);
      series.push({
        x: `${String(cur_date.getHours()).padStart(2, "0")}:${String(
          cur_date.getMinutes()
        ).padStart(2, "0")}`,
        y: Math.random() * (rate * 2) + rate / 2,
      });
    }
  }
  return series;
};

const generateDailyDataSeries = (rate?: number) => {
  const dayList = ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];
  const series = [];
  if (rate !== undefined) {
    for (let i = 0; i < 7; i++) {
      series.push({
        x: dayList[i],
        y: Math.random() * (rate * 2) + rate / 2,
      });
    }
  }
  return series;
};

const createOptions = (title: string, x_title: string): ApexOptions => {
  return {
    chart: {
      toolbar: {
        show: false,
      },
      offsetX: -20,
      offsetY: 10,
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      type: "category",
      tickAmount: 8,
      labels: {
        rotate: 0,
      },
      title: {
        text: x_title,
        offsetX: 350,
        offsetY: -50,
      },
      axisBorder: {
        show: true,
        color: "#00718F",
      },
    },
    yaxis: {
      decimalsInFloat: 0,
      show: true,
      labels: {
        show: false,
      },
      title: {
        text: "Value",
        rotate: 0,
        offsetY: -60,
        offsetX: 20,
      },
      axisBorder: {
        show: true,
        color: "#00718F",
      },
    },
    colors: ["#00718F"],
    grid: { show: false },
    title: {
      text: title,
      floating: true,
      align: "right",
      style: {
        fontFamily: "Arial, Helvetica, sans-serif",
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
  };
};

const CurrencyChart = (props: { rate?: number; title?: string }) => {
  return (
    <div className="currency-chart">
      <div className="header">
        <h1>{`${props.title} Currency`}</h1>
      </div>
      <div className="chart">
        <div className="hourly-chart">
          <LineChart
            series={[
              { data: generateHourlyDataSeries(props.rate), name: "Hourly" },
            ]}
            options={createOptions("Hourly Data", "Hrs")}
          />
        </div>
        <div className="daily-chart">
          <LineChart
            series={[
              { data: generateDailyDataSeries(props.rate), name: "Daily" },
            ]}
            options={createOptions("Daily Data", "Day")}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrencyChart;
