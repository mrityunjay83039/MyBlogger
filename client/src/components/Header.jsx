import { useContext } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    const getUserProfileInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log("userprofile: ", data);
        }

        if (!res.success) {
          alert(res.error);
        }
      } catch (error) {
        console.error("getting user profile: ", error);
      }
    };
    getUserProfileInfo();
  }, []);

  const userLogout = async () => {
    const res = await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });
    console.log("logout: ", res);

    if (res.ok) {
      setUserInfo(null);
    }
  };

  return (
    <header>
      <Link to="/" className="logo">
        MyBlogger
      </Link>

      {userInfo ? (
        <nav>
          <Link to="/create">Create Post</Link>
          <Link onClick={userLogout}>Logout</Link>
        </nav>
      ) : (
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
