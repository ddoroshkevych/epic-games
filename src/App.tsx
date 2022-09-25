import React from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Hangman from "./pages/Hangman";
import Snake from "./pages/Snake";
import Tennis from "./pages/Tennis";

const App = () => {
  return (
    <div>
      <Header />
      <hr />
      <Routes>
        <Route path="/" element={<Main />}  />
        <Route path="/hangman" element={<Hangman />} />
        <Route path="/snake" element={<Snake />} />
        <Route path="/tennis" element={<Tennis />} />
      </Routes>
      <hr />
      <Footer />
    </div>
  );
}

export default App;
