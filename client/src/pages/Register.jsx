import React from "react";

const Register = () => {
  const register = () => {};
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type="text" placeholder="username" value="" />
      <input type="password" placeholder="password" value="" />
      <button>Register</button>
    </form>
  );
};

export default Register;
