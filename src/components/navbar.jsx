export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <span>Live</span>Lot
      </div>

      <div className="nav-links">
        <a href="#">About</a>
        <a href="#">Explore</a>
        <a href="#">Contact</a>
        <button className="nav-btn">Login</button>
      </div>
    </nav>
  );
}
