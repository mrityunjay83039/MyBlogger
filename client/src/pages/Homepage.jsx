import { useEffect, useState } from "react";
import Posts from "../components/Posts";

const Homepage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
   
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:5000/all-posts");
      const data = await response.json();
      if (data.success) {
        setPosts(data.data);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {posts?.map((post) => (
        <Posts data={post} key={post._id || post.id} />
      ))}
    </div>
  )
  
};

export default Homepage;
