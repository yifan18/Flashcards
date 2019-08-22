import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { createForm } from "rc-form";
import { FormGroup, InputGroup, Button, Icon } from "@blueprintjs/core";

function App() {
  const newCard = ({ front }) => {
    //check for support
    if (!("indexedDB" in window)) {
      console.log("This browser doesn't support IndexedDB");
      return;
    }
    const dbPromise = indexedDB.open("flashcards", 1, function(db) {
      if (!db.objectStoreNames.contains("card")) {
        db.createObjectStore("card", { keyPath: "id", autoIncrement: true });
      }

      var tx = db.transaction("card", "readwrite");
      var card = tx.objectStore("card");
      var item = {
        front,
        back: "",
        imgs: [],
        tags: [],
        created: new Date().getTime()
      };
      card.add(item);
      if (tx.complete) console.log("added item to the card os!");
    });
    // console.log('dbPromise', dbPromise)
    // dbPromise
    //   .then(function(db) {
    //     var tx = db.transaction("card", "readwrite");
    //     var card = tx.objectStore("card");
    //     var item = {
    //       front,
    //       back: "",
    //       imgs: [],
    //       tags: [],
    //       created: new Date().getTime()
    //     };
    //     card.add(item);
    //     return tx.complete;
    //   })
    //   .then(function() {
    //     console.log("added item to the card os!");
    //   });
  };
  return (
    <div>
      <h1>Cards</h1>
      <div>
        <WordEdit onSubmit={newCard} />
      </div>
      <div />
    </div>
  );
}


const WordEdit = createForm()(class WordEdit extends React.Component{
  render(){
    const { form, onSubmit } = this.props;
    return (
      <div>
        <FormGroup label="front">
          {form.getFieldDecorator("front", {
            rules: [{ require: true, message: "please input" }]
          })(<InputGroup />)}
        </FormGroup>
        <FormGroup label="">
          <Button
            intent="success"
            text="create"
            onClick={() => {
              console.log('gggg')
              const values = form.getFieldsValue();
              onSubmit(values);
            }}
          />
          <a onClick={() => {
            // debugger
            var a = '15'
          }}> click</a>
        </FormGroup>
      </div>
    );
  }
})


// const WordEdit = createForm()(function WordEdit({ form, onSubmit }) {
//   return (
//     <div>
//       <FormGroup label="front">
//         {form.getFieldDecorator("front", {
//           rules: [{ require: true, message: "please input" }]
//         })(<InputGroup />)}
//       </FormGroup>
//       <FormGroup label="">
//         <Button
//           intent="success"
//           text="create"
//           onClick={() => {
//             console.log('gggg')
//             const values = form.getFieldsValue();
//             onSubmit(values);
//           }}
//         />
//       </FormGroup>
//     </div>
//   );
// });

export default App;
