import { ReactNode } from "react";

interface TooltipProps {
  isVisible: boolean;
  children: ReactNode;
  position: { x: number; y: number };
}

const ChartTooltip = (props: TooltipProps) => {
  if (!props.isVisible) {
    return null;
  }

  return (
    <div
      className="chart-tooltip"
      style={{ left: props.position.x, top: props.position.y }}
    >
      {props.children}
    </div>
  );
};

export default ChartTooltip;
