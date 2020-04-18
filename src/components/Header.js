import React from "react";
import packageJson from "../../package.json";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";

function Header() {
  return (
    <Navbar collapseOnSelect bg="black" expand="lg" variant="black">
      <Navbar.Brand>
        <h3>
          <Link to="/">
            Polymatic <small>{packageJson.version}</small>
          </Link>
        </h3>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    </Navbar>
  );
}
export default Header;
