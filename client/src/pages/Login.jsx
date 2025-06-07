import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect , setRedirect] = useState(false);

  const navigate = useNavigate();

  const {setUserInfo} = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if(data.success){
        alert(data.message)
        setRedirect(true);
        setUserInfo(data?.data?.username);
      }else{
        alert('wrong credentials');
      }
    
    } catch (error) {
      console.log("error while login: ", error);
    }
  };

  if(redirect){
    return navigate("/");
  }

  return (
    <form className="login" onSubmit={handleLogin}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  );
};

export default Login;
