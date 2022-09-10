import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } =
    useContext(AuthContext); /* Expl. abajo de currentUser */

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axiosInstance.put("/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post.img && <img className="postImg" src={PF + post.img} alt="" />}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">
              {like} personas les gusta esto
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comentarios</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Así es como se organiza la aplicación React:
Al hacer clic en el botón Log in o Log out, la aplicación llama a las funciones definidas en requests/auth.ts para realizar consultas al servidor.
La información sobre el usuario actual se almacena en el componente raíz App.tsx bajo el nombre currentUser. Si el usuario se ha conectado, este estado es de tipo { id: number, name: string }. En caso contrario, su valor es null.
Al iniciar la sesión, el servidor devuelve información sobre el usuario que se utiliza para establecer el estado currentUser. Al cerrar la sesión, la aplicación establece este estado como null.
Saber, en el lado del cliente, si un usuario está conectado y quién es, es útil para gestionar la visualización de los elementos de la interfaz de usuario. Esto nos permite, por ejemplo, saber qué botones de navegación deben ser visibles. */
