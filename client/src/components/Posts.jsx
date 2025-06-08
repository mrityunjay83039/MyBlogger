import moment from "moment";
import {Link} from 'react-router-dom';

const Posts = ({ data }) => {
  const APIURL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="post">
      <Link to={`/post/${data._id}`} className="image">
        <img src={APIURL + "/" + data?.cover} alt="" />
      </Link>

      <div className="texts">
        <Link to={`/post/${data._id}`}>
          <h2>{data?.title}</h2>
        </Link>

        <p className="info">
          <a href="" className="author">
            {data?.author?.username}
          </a>
          <time>
            {moment(data?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
          </time>
        </p>
        <p className="summary">{data?.summary}</p>
      </div>
    </div>
  );
};

export default Posts;
