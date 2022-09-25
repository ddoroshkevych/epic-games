import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <Link to="/">
        <h3>Home </h3>
      </Link>
      <Link to="/hangman">
        <h3>Hangman </h3>
      </Link>
      <Link to="/snake">
        <h3>Snake </h3>
      </Link>
      <Link to="/tennis">
        <h3>Tennis </h3>
      </Link>
    </div>
  );
}
