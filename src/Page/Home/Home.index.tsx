import { Link } from "react-router-dom";
import "./style.scss";
import { ReactNode } from "react";

function Home() {
  return (
    <menu>
      <Link to="/machine-utilization">
        <MenuItem>Machine Utilization</MenuItem>
      </Link>
      <Link to="/calendar">
        <MenuItem>Calendar</MenuItem>
      </Link>
      <Link to="/historical-currency">
        <MenuItem>Currency</MenuItem>
      </Link>
      <Link to="/chat-box">
        <MenuItem>Chat App</MenuItem>
      </Link>
    </menu>
  );
}

export default Home;

function MenuItem(props: { children: ReactNode }) {
  return (
    <li className="menu-item">
      <h1>{props.children}</h1>
    </li>
  );
}
