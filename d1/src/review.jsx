import React, { useState, useEffect } from "react";
import {
  Card,
  Spinner,
  InputGroup,
  Label,
  Icon,
  Tag,
  Button,
  ButtonGroup,
  Intent,
  Colors
} from "@blueprintjs/core";

import { createStoreConnect, STORE_CARD, STORE_SETTING } from "./db";

const cardStore = createStoreConnect(STORE_CARD);

export function Review({ type }) {
  const [state, setState] = useState({
    loading: true,
    list: [],
    current: 0
  });

  useEffect(() => {
    cardStore.query().then(list => this.setState({ loading: false, list }));
  }, []);

  const defaultView = ["back", "picture"];
  const currentCard = state.list[state.current];
  const _onClick = type => () => {
  };

  return (
    <div style={{ width: 800, margin: "0 auto" }}>
      <div className={loading ? "bp3-skeleton" : ""}>
        {current} / {list.length}
      </div>
      <Card interactive elevation={2} style={{ width: "100%", minHeight: 500 }}>
        <div>
          <Icon icon="tag" />
          {currentCard.tags.map(text => (
            <Tag minimal title={text} style={{ marginLeft: 5 }} />
          ))}
        </div>
        {defaultView.map(key => {
          return (
            <div style={{ marginTop: 15 }}>
              <Label disabled>
                {key.slice(0, 1).toUpperCase() + key.slice(1)}
                {key === "picture" ? (
                  <img src={currentCard.picture} style={{ maxHeight: 100 }} />
                ) : (
                  <div style={{ marginTop: 8, fontSize: 16 }}>
                    {currentCard[key]}
                  </div>
                )}
              </Label>
            </div>
          );
        })}

        <div style={{ padding: 10 }}>
          <ButtonGroup fill>
            <Button intent={Intent.WARNING} large onClick={_onClick(1)}>
              Remind Later
            </Button>
            <Button intent={Intent.PRIMARY} large onClick={_onClick(2)}>
              Need Strengthen
            </Button>
            <Button intent={Intent.SUCCESS} large onClick={_onClick(3)}>
              Remembered
            </Button>
          </ButtonGroup>
        </div>
      </Card>
      <div style={{ textAlign: "right" }}>
        <span style={{ color: Colors.LIGHT_GRAY1 }} onClick={_onClick(4)}>
          Don't show it again.
        </span>
      </div>
    </div>
  );
}
