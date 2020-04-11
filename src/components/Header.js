import React from "react";
import packageJson from "../../package.json";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

function Header() {
  return (
    <Navbar collapseOnSelect expand="lg">
      <Navbar.Brand>
        <h3>
          <Link to="/">
            Polymatic <small>{packageJson.version}</small>
          </Link>
        </h3>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav>
          <Navbar.Text>
            <Link to="/">Inicio</Link>
          </Navbar.Text>
          <Navbar.Text>
            <Link to="/sobre">Sobre</Link>
          </Navbar.Text>
          <Navbar.Text>
            <Link to="/ajuda">Ajuda</Link>
          </Navbar.Text>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default Header;
