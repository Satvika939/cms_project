import "./Header.css";
import logo from "./chaishots.png";
function Header() {
  return (
    <header className="app-header">
      {/* Left: Logo */}
      <div className="header-left">
        <img
          src={logo}
          className="logo"
          
        />
      </div>

      {/* Center: Title */}
      <div className="header-center">
        <h1>Content Management System</h1>
      </div>

      {/* Right: Company & Social */}
      <div className="header-right">
        <span className="company-name">Chai Shots</span>

        <div className="social-icons">
          <a href="#" title="Twitter">🐦</a>
          <a href="#" title="LinkedIn">💼</a>
          <a href="#" title="GitHub">🐙</a>
        </div>
      </div>
    </header>
  );
}

export default Header;
