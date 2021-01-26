import React from "react";
import packageJson from "../../package.json";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
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

      <Nav className="justify-content-end">
        <Nav.Link href="mailto:polymatic@ciberterreiro.org">
          <FontAwesomeIcon icon={faEnvelope} className="github" size="2x" />
        </Nav.Link>
        <Nav.Link
          href="https://github.com/guilhermecomum/polymatic"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} className="github" size="2x" />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
export default Header;
