import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import { useEffect } from "react";

const UpdatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { id } = useParams();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const res = await fetch(`${BASE_URL}/post/${id}`);
        const data = await res.json();
        if (data.success) {
          setTitle(data.data.title);
          setSummary(data.data.summary);
          setContent(data.data.content);
          setFiles(data.data.files);
        }
      } catch (error) {
        console.error("error while fetching blog post for edit: ", error);
      }
    };
    fetchBlogPost();
  }, []);

  const updatePost = async (ev) => {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const response = await fetch(BASE_URL+"/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  };


  if (redirect) {
    return navigate("/post/" + id);// redirect to the updated post
  }

  return (
    <form onSubmit={updatePost}>
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
      <button style={{ marginTop: "5px" }}>Update Post</button>
    </form>
  );
};

export default UpdatePost;
