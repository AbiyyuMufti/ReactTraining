import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { TSignUpPayload, TUserID } from "./Type/Posts";
import AuthContext from "../../Component/Context/AuthProvider";
import Button from "../../Component/ReusableComponent/Button";
import useUserLoginAuth from "./Hooks/useUserLoginAuth";
import "./style.scss";

function LoginPage() {
  const { setUser } = useContext(AuthContext);
  const { expanded, authenticateUser, signUp } = useUserLoginAuth(setUser);
  const navigator = useNavigate();

  return (
    <div className="login-main">
      <form className="login-main-container" onSubmit={onSubmitHandler}>
        <div className="header">Login</div>
        <div className="content">
          <div className="input-element">
            <label htmlFor="id-input">ID&emsp;:&emsp;</label>
            <input id="id-input" name="id-input" />
          </div>
          {expanded && (
            <>
              <div className="input-element">
                <label htmlFor="name-input">Name&emsp;:&emsp;</label>
                <input id="name-input" name="name-input" />
              </div>
              <div className="input-element">
                <label htmlFor="position-input">Position&emsp;:&emsp;</label>
                <input id="position-input" name="position-input" />
              </div>
              <div className="input-element">
                <label htmlFor="country-input">Country&emsp;:&emsp;</label>
                <input id="country-input" name="country-input" />
              </div>
            </>
          )}
          <div className="button-container">
            <Button type="submit">Confirm</Button>
            <Button type="reset">Cancel</Button>
          </div>
        </div>
      </form>
    </div>
  );

  async function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = formData.get("id-input")?.toString();
    if (!user) return;
    let payload: TSignUpPayload | TUserID = {
      id: user,
    };
    if (expanded) {
      const name = formData.get("name-input")?.toString();
      if (!name) return;
      payload = {
        ...payload,
        name: name,
        position: formData.get("position-input")?.toString() || "",
        country: formData.get("country-input")?.toString() || "",
      };
      console.log(payload);
      const signingUp = await signUp(payload);
      if (signingUp) navigator("/home");
    } else {
      const authenticated = await authenticateUser(payload);
      if (authenticated) navigator("/home");
    }
  }
}

export default LoginPage;
