import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

interface LineChartProps {
  options?: ApexOptions;
  series?: ApexAxisChartSeries;
}

const LineChart = (props: LineChartProps) => {
  return (
    <ReactApexChart
      options={props.options}
      series={props.series}
      type="line"
      height="100%"
      width="100%"
    />
  );
};

export default LineChart;
