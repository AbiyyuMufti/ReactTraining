import { useEffect, useRef, useState } from "react";
import { TimelineChartProps, TimelineData } from "../Type/MachineUtilsPosts";
import { COLOR_CODE } from "../Constant/MachineConstant";
import ChartTooltip from "./ChartTooltip";

const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  data.forEach(() => {});

  const axisRef = useRef<SVGSVGElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const [axisWidth, setAxisWidth] = useState(0);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (axisRef.current) {
        const widthRef = axisRef.current.parentElement?.clientWidth || 0;
        const svg = axisRef.current;
        svg.setAttribute("width", `${widthRef}px`);
        setAxisWidth(widthRef);
      }
      if (chartRef.current) {
        const widthRef = chartRef.current.parentElement?.clientWidth || 0;
        const svg = chartRef.current;
        svg.setAttribute("width", `${widthRef}px`);
        setChartWidth(widthRef);
      }
    };

    handleResize(); // Set initial dimensions

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipCurrentData, setTooltipCurrentData] =
    useState<TimelineData | null>(null);
  const [tooltipPosition, setTootltipPosition] = useState({ x: 0, y: 0 });

  const totalSecondInTheDay = 24 * 60 * 60;
  const axis_position = 10;
  const axis_margin = 20;
  const axis_length = axisWidth - 2 * axis_margin;
  const tick_margin = 20;
  const axis_length_tick = axis_length - 2 * tick_margin;
  const chart_height = "100%";
  const xHourlyTickInterval =
    (axis_length_tick * 60 * 60) / totalSecondInTheDay;
  const xSecondlyTickInterval = axis_length_tick / totalSecondInTheDay;

  const computeSecondInADay = (epochDate: number) => {
    const startSecondOfTheDay = new Date(epochDate);
    startSecondOfTheDay.setHours(0, 0, 0, 0);
    const secondElapse = (epochDate - startSecondOfTheDay.getTime()) / 1000;
    return secondElapse;
  };

  return (
    <div className="timeline-chart">
      <div className="flex-item chart-part">
        <svg
          ref={chartRef}
          height="100%"
          width="100%"
          className="chart-part"
          viewBox={`0 0 ${chartWidth} ${100}`}
        >
          {data.map((entry, index) => {
            const [start, end] = entry.runtime;
            const startX =
              axis_margin +
              tick_margin +
              computeSecondInADay(start) * xSecondlyTickInterval;
            const width = (end - start) / 1000;
            return (
              <rect
                key={index}
                x={startX}
                y={20}
                width={width * xSecondlyTickInterval}
                height={chart_height}
                className={`timeline-entry`}
                style={{ fill: (COLOR_CODE as any)[entry.status] }}
                onMouseMove={(e) => {
                  setTooltipCurrentData(entry);
                  setTootltipPosition({ x: e.clientX, y: e.clientY });
                  setTooltipVisible(true);
                }}
                onMouseLeave={() => {
                  setTooltipVisible(false);
                }}
              />
            );
          })}
        </svg>
      </div>
      <div className="flex-item x-axis-part">
        <svg ref={axisRef} height="100%" width="100%" className="axis-part">
          <line
            x1={axis_margin}
            y1={axis_position}
            x2={axis_margin + axis_length}
            y2={axis_position}
            stroke="#000"
            strokeWidth="2"
          />
          {Array.from({ length: 25 }).map((_, index) => {
            const xPos =
              axis_margin + tick_margin + index * xHourlyTickInterval;
            return (
              <g key={index}>
                <line
                  x1={xPos}
                  y1={axis_position - 5}
                  x2={xPos}
                  y2={axis_position + 5}
                  stroke="#000"
                  strokeWidth="2"
                />
                {index % 2 === 0 && (
                  <text x={xPos} y={axis_position + 20} textAnchor="middle">
                    {`${index.toString().padStart(2, "0")}:00`}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <ChartTooltip isVisible={tooltipVisible} position={tooltipPosition}>
        <TooltipContent data={tooltipCurrentData} />
      </ChartTooltip>
    </div>
  );
};

const TooltipContent = (props: { data: TimelineData | null }) => {
  const [start, end] = props.data?.runtime || [0, 0];
  const startime = new Date(start).toLocaleTimeString("en-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const endtime = new Date(end).toLocaleString("en-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return (
    <>
      <div className="tooltip-title">{props.data?.status}</div>
      <div>{`${startime} - ${endtime}`}</div>
    </>
  );
};

export default TimelineChart;
