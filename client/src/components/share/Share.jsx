import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  /* Su declaración es sencilla:
          const variableDeReferencia = useRef(valorInicial);
Por ejemplo:
          const desc = useRef();
      La constante desc almacena una referencia al DOM que no tiene valor inicial.
Para poder enlazar nuestra referencia, por ejemplo, a un input, se usa la propiedad ref
          <input type="text" ref={desc} />
      Ahora nuestra variable desc tiene una referencia directa al input, gracias a la propiedad ref. 
Ahora bien, si imprimimos por consola el contenido de la variable desc veremos que nos regresa un objeto con la propiedad current y dentro de ella la referencia al input, dicha referencia tiene en su interior todas las propiedades que pueden ser usadas en un input de tipo text, como por ejemplo: className, value, id, name, placeholder, entre otras.*/
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current
        .value /* Cuando una referencia es pasada a un elemento en el renderizado, una referencia al nodo pasa a ser accesible en el atributo current de la referencia. */,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
      try {
        await axiosInstance.post("/upload", data);
      } catch (err) {}
    }
    try {
      await axiosInstance.post("/posts", newPost);
      window.location.reload(); /* El metodo location.reload() carga de nuevo la URL actual, como lo hace el boton de Refresh de los navegadores. */
    } catch (err) {}
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"¿Qué estás pensando " + user.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Foto o Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Etiqueta</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Ubicación</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">¿Cómo te sientes?</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
}

/* El método createObjectURL() crea un DOMString que contiene una URL que representa el objeto dado en el parámetro del método. La URL del nuevo objeto representa el objeto Archivo.
Salida: seleccionaremos una imagen del almacenamiento local y luego se creará la URL de ese objeto. */
