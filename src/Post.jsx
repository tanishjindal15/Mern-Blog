import { Link } from "react-router-dom";

function Post({ _id, title, summary, cover, content, createdAt, author }) {
  console.log("Cover Image URL:", cover);
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img id="first" src={cover} alt="Post Cover" onError={(e) => e.target.style.display = 'none'} />
        </Link>
      </div>
      <div className="text">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author?.username || "Unknown"}</a>
          <time>{new Date(createdAt).toLocaleString()}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}

export default Post;
