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
  Position
} from "@blueprintjs/core";
import { Cards } from "./cards";
import { Review } from "./review";
import { Router, Route, withRouter, Switch, Redirect } from "react-router-dom";

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
