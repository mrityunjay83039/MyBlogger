import moment from "moment";
const Posts = ({ data }) => {
  const APIURL = import.meta.env.VITE_BASE_URL;

  return (
    <div className="post">
      <div className="image">
        <img src={APIURL + "/" + data?.cover} alt="" />
      </div>

      <div className="texts">
        <h2>{data?.title}</h2>
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
