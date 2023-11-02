import ReactApexChart from "react-apexcharts";

const ScheduledChart = (props: any) => {
  return (
    <ReactApexChart
      options={props.options}
      series={props.series}
      type="rangeBar"
      height="100%"
    />
  );
};

export default ScheduledChart;
