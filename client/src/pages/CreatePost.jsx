import { useState } from "react";
import Editor from "../components/Editor";
import {useNavigate} from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  const navigate = useNavigate();

  const createNewPost = async (e) => {
    const data = new FormData();
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    data.append("files", files[0]);

    e.preventDefault();
    try {
      let res = await fetch("http://localhost:5000/post", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      res = await res.json();
      if (res.success) {
        alert(res.message);
        setRedirect(true);
      }
    } catch (error) {
      console.log("creating blog post: ", error);
    }
  };

  if(redirect){
    return navigate('/');
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }}>Create post</button>
    </form>
  );
};

export default CreatePost;
