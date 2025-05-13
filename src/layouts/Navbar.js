import React, { use, useState,useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../assets/Navbar.css"; // Import custom CSS
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark  shadow-lg p-3" style={{ backgroundColor: " #1d4961" }}>
      <div className="container-fluid">
        
        {/* Logo */}
        <a className="navbar-brand fs-4 fw-bold" href="#">CIT</a>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item dropdown hover-dropdown">
                 <a className="nav-link" href="/QuizNotice">Notice</a>
            </li>
            <li className="nav-item dropdown hover-dropdown">
                 <a className="nav-link" href="/QuizClasses">Classes</a>
            </li>
            <li className="nav-item dropdown hover-dropdown">
                 <a className="nav-link" href="/QuizResult">Quiz Result</a>
            </li>
            <li className="nav-item dropdown hover-dropdown">
                 <a className="nav-link" href="QuizLink">Class Link</a>
            </li>
            
            <li className="nav-item dropdown hover-dropdown">
                 <a className="nav-link" href="/TestPage">Information</a>
            </li>


        

          </ul>

          {/* Search Bar */}
          <form className="d-flex">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                aria-label="Search"
              />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
