import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axiosInstance.get("/posts/profile/" + username)
        : await axiosInstance.get("posts/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          /* El método sort() ordena los elementos de un arreglo (array) localmente y devuelve el arreglo ordenado. */
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}

/* Función useEffect que obtiene publicaciones de la base de datos y luego establece el estado de las posts y luego las envía al componente Posts , pongo el estado de las posts en la dependencia useEffect , por lo que si el usuario crea una nueva publicación, el componente Posts vuelve a renderizar ¡el usuario no necesita actualizar la página! */
