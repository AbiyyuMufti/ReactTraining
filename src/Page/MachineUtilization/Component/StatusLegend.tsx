import { ReactNode } from "react";

const StatusLegend = (props: { children: ReactNode; color: string }) => {
  const circle_style = {
    backgroundColor: props.color,
    height: "16px",
    width: "16px",
    borderRadius: "50%",
  };
  const label_style = {
    color: props.color,
    fontSize: "18px",
    fontWeight: "bold",
  };
  return (
    <div className="status-item">
      <div className="dot" style={circle_style} />
      <div style={label_style}>{props.children}</div>
    </div>
  );
};

export default StatusLegend;
