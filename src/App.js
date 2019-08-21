import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const newCard = () => {
    //check for support
    if (!("indexedDB" in window)) {
      console.log("This browser doesn't support IndexedDB");
      return;
    }
    const dbPromise = indexedDB.open("flashcards", 1);
  };
  return (
    <div>
      <h1>Cards</h1>
      <div>
        <a onClick={newCard}>new</a>
      </div>
      <div />
    </div>
  );
}

export default App;
