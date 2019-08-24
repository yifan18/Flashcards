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

function App() {
  const [state, setState] = useState({ pageIndex: 1 });

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
            onClick={() => setState({ pageIndex: 1 })}
          />
          <Popover
            content={
              <Menu>
                <MenuItem
                  icon="duplicate"
                  text="Read Review"
                  onClick={() => setState({ pageIndex: 2 })}
                />
                <MenuItem
                  icon="highlight"
                  text="Spell Review"
                  onClick={() => setState({ pageIndex: 3 })}
                />
                <MenuItem
                  icon="resolve"
                  text="Recall Review"
                  onClick={() => setState({ pageIndex: 4 })}
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

      <div style={{paddingTop: 12}}>{state.pageIndex === 1 && <Cards />}</div>
    </div>
  );
}

export default App;
