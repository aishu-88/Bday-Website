import "../styles/navbar.css";
import { FaHeart } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <FaHeart />
        Birthday_Project
      </div>

      <ul>

        <li>
          <a href="#home">Home</a>
        </li>

        <li>
          <a href="#gallery">Memories</a>
        </li>

        <li>
          <a href="#video">Video</a>
        </li>

        <li>
          <a href="#letter">Letter</a>
        </li>

        <li>
          <a href="#surprise">Surprise</a>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;