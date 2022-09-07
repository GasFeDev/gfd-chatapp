import { useRef } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import { useHistory } from "react-router";
import { axiosInstance } from "../../config";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("¡Las contraseñas no coinciden!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axiosInstance.post("/auth/register", user);
        history.push(
          "/login"
        ); /* Podemos empujar a los usuarios de una página a otra usando history.push. Cuando usamos el método push, solo necesitamos proporcionar la ruta que queremos llevar a nuestros usuarios a usar este método. */
      } catch (err) {
        console.log(err);
      }
    }
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
              placeholder="Nombre de usuario"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Correo electrónico"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Contraseña"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Nuevamente ingrese su contraseña"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" type="submit">
              Registrarse
            </button>
            <button className="loginRegisterButton">
              <Link to="/login" style={{ textDecoration: "none" }}>
                Iniciar sesión
              </Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
