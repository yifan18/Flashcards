import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Button,
  Classes,
  Navbar,
  NavbarGroup,
  NavbarDivider,
  NavbarHeading,
  Menu,
  MenuItem,
  Popover,
  Position,
  Toaster,
  Intent
} from "@blueprintjs/core";
import { Cards } from "./cards";
import { Review } from "./review";
import { Router, Route, withRouter, Switch, Redirect } from "react-router-dom";
import { createStoreConnect, STORE_CARD } from './db';

const cardStore = createStoreConnect(STORE_CARD)

function App({ history }) {
  return (
    <div style={{ padding: 12 }}>
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>Flashcards</NavbarHeading>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon="git-repo"
            text="Cards"
            onClick={() => history.push("/cards")}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  icon="duplicate"
                  text="Read Review"
                  onClick={() => history.push("/test/read")}
                />
                <MenuItem
                  icon="highlight"
                  text="Spell Review"
                  onClick={() => history.push("/test/spell")}
                />
                <MenuItem
                  icon="resolve"
                  text="Recall Review"
                  onClick={() => history.push("/test/recall")}
                />
              </Menu>
            }
            position={Position.BOTTOM_LEFT}
          >
            <Button
              className={Classes.MINIMAL}
              icon="layout-auto"
              rightIcon="caret-down"
              text="Review"
            />
          </Popover>
        
          <NavbarDivider />
          <Button
            minimal
            onClick={() => {
            const input = document.createElement('input')
            input.type = 'file';
            input.style.display = 'none';
            input.addEventListener('change', function(e){
              if(e.target.files.length){
                const file = e.target.files[0];
                var reader = new FileReader();
                reader.onload = function(){
                  var text = reader.result;
                  const rows = text.split('\r\n')
                  const list = rows.map(row => {
                    const [x, word, content, remembered, time] = row.split(',');
                    const match = content.match(/(.+?)\[(https?:\/\/.+?)\]/)
                    return  {
                      front: word.replace(/"/g, ''),
                      back: (match ? match[1] : content).replace(/"/g, ''),
                      picture: match ? match[2] : '',
                      tags: [],
                      readLevel: remembered === '1' ? 7 : 1,
                      spellLevel: remembered === '1' ? 7 : 1,
                      recallLevel: remembered === '1' ? 7 : 1
                    }

                  })
                  // console.log('list', list)
                  cardStore.batchAdd(list).then(() => Toaster.create().show({intent: Intent.SUCCESS, message: 'imported!'}))
                  // try{
                  //   console.log(JSON.stringify([]))
                  // }catch(error){
                  //   console.error(error)
                  // }
                };
                reader.readAsText(file);
              }
              document.body.removeChild(input)
            })
            document.body.appendChild(input);

            var clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            input.dispatchEvent(clickEvent)
          }}>Batch Import</Button>
        </NavbarGroup>
      </Navbar>

      <div style={{ paddingTop: 12, width: 800, margin: '0 auto' }}>
        {/* <Route exact path="/cards" component={Cards} /> */}
        <Switch>
          <Route
            exact
            path="/test/read"
            render={() => <Review type="read" />}
          />
          <Route
            exact
            path="/test/spell"
            render={() => <Review type="spell" />}
          />
          <Route
            exact
            path="/test/recall"
            render={() => <Review type="recall" />}
          />
          <Route exact path="/" component={Cards} />
          <Redirect
            to={{
              pathname: "/"
            }}
          ></Redirect>
        </Switch>
      </div>
    </div>
  );
}

App = withRouter(App);

export default App;
// export default App;
// export default function(){
//   return <div>111</div>
// };
