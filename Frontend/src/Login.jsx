import "./App.css";
export default function Login() {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Đăng Nhập</h2>
        <form>
          <label>Email</label>
          <input type="email" placeholder="Nhập email" />

          <label>Password</label>
          <input type="password" placeholder="Nhập mật khẩu" />

          <button type="submit">Đăng nhập</button>
        </form>
        <p>
          Chưa có tài khoản? <a href="#">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
}
