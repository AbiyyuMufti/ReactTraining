import { Link } from "react-router-dom";
import CADITLogo from "../../Media/Image/CADITLogo.png";
import HomeLogo from "../../Media/Image/home.png";

import AcountLogo from "../../Media/Image/userLogo.png";

const Header = (props: { useHome: boolean; userName?: string }) => {
  return (
    <div className="main-container__header">
      <img src={CADITLogo} alt=""></img>
      {props.useHome && (
        <Link to="/home">
          <img className="home-logo" src={HomeLogo} alt="" />
        </Link>
      )}
      {props.userName && (
        <div className="user-name">
          <div>
            <img src={AcountLogo} alt="" />
            <div>{props.userName}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
