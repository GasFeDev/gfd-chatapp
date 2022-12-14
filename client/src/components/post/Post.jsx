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

/* As?? es como se organiza la aplicaci??n React:
Al hacer clic en el bot??n Log in o Log out, la aplicaci??n llama a las funciones definidas en requests/auth.ts para realizar consultas al servidor.
La informaci??n sobre el usuario actual se almacena en el componente ra??z App.tsx bajo el nombre currentUser. Si el usuario se ha conectado, este estado es de tipo { id: number, name: string }. En caso contrario, su valor es null.
Al iniciar la sesi??n, el servidor devuelve informaci??n sobre el usuario que se utiliza para establecer el estado currentUser. Al cerrar la sesi??n, la aplicaci??n establece este estado como null.
Saber, en el lado del cliente, si un usuario est?? conectado y qui??n es, es ??til para gestionar la visualizaci??n de los elementos de la interfaz de usuario. Esto nos permite, por ejemplo, saber qu?? botones de navegaci??n deben ser visibles. */
