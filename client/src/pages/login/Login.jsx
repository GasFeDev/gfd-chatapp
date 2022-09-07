import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">FedeRedSocial</h3>
          <span className="loginDesc">
            Conéctate con amigos y el mundo que te rodea en FedeRedSocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Correo electrónico"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Contraseña"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Iniciar sesión"
              )}
            </button>
            <span className="loginForgot">¿Olvidó la contraseña?</span>
            <button className="loginRegisterButton">
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                <Link to="/register" style={{ textDecoration: "none" }}>
                  Crea una cuenta nueva
                </Link>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
