const Login = () => {
  return (
    <form className="login" onSubmit={() => {}}>
      <h1>Login</h1>
      <input type="text" placeholder="username" value="" />
      <input type="password" placeholder="password" value="" />
      <button>Login</button>
    </form>
  );
};

export default Login;
