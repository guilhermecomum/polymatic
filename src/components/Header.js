import React from "react";
import packageJson from "../../package.json";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

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
      <Nav className="mr-auto">
        <Nav>
          <Link to="/sobre">sobre</Link>
        </Nav>
      </Nav>
    </Navbar>
  );
}
export default Header;
