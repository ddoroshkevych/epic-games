import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";

const element = document.getElementById("root");
const root = ReactDOM.createRoot(element as Element);
root.render(
  <Router>
    <App />
  </Router>
);

reportWebVitals();
