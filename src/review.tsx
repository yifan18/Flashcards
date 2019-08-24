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
  Colors,
  NonIdealState,
  MenuDivider,
  Toaster
} from "@blueprintjs/core";

import {
  createStoreConnect,
  STORE_CARD,
  STORE_SETTING,
  CardStore,
  KVStore
} from "./db";
import * as dic from "./dictionary";

const cardStore = createStoreConnect(STORE_CARD);
const settingStore = createStoreConnect(STORE_SETTING);

function Body({ children }) {
  return <div style={{ width: 800, margin: "28px auto 0" }}>{children}</div>;
}

export function Review({ type }: { type: "read" | "spell" | "recall" }) {
  const [state, setState] = useState({
    loading: true,
    list: [],
    current: 0,
    currentCompleted: false,
    showAnswer: false,
    defaultView: new Array()
  });

  const _setState = setState as any;

  const defaultView = state.defaultView;
  const currentCard = state.list[state.current] as CardStore;
  const levelName = type + "Level";
  const lastTestName = "last" + type.slice(0, 1).toUpperCase() + type.slice(1);

  const refresh = () => {
    Promise.all([
      cardStore.query(function(record: CardStore) {
        if (!record[levelName]) return true;
        // 转成ms
        const intervalTime = dic.REMIND_LEVELS[record[levelName]] * 60e3;
        const lastTest = record[lastTestName] || 0;
        if (Date.now() - lastTest > intervalTime) return true;
        return false;
      }),
      settingStore.queryById(type + "_default_view")
    ]).then(values => {
      const list = values[0] as CardStore[];
      // reset
      _setState({
        ...state,
        list: list,
        current: list.length ? 0 : state.current,
        currentCompleted: false,
        defaultView: values[1].value,
        loading: false
      });
    });
  };

  useEffect(() => {
    refresh();
    return registerHotKeyboard(function(e) {
      console.log(e.keyCode);
      if (e.keyCode === 13) {
        next();
      }
    });
  }, []);

  const _onClick = chooseKey => () => {
    const oldLevel = currentCard[levelName];
    const maxLevel = dic.REMIND_LEVELS.length - 1;
    let nextLevel = -1;

    switch (chooseKey) {
      case 1:
        if (oldLevel < dic.HOUR_LEVEL) {
          nextLevel = oldLevel + 1;
        } else {
          nextLevel = dic.HOUR_LEVEL;
        }
        break;
      case 2:
        if (oldLevel < dic.DAY_LEVEL) {
          nextLevel = oldLevel + 1;
        } else {
          nextLevel = dic.DAY_LEVEL;
        }
        break;
      case 3:
        nextLevel = oldLevel + 1;
        break;
      default:
        nextLevel = maxLevel;
    }

    cardStore
      .modify(
        {
          id: currentCard.id,
          [levelName]: nextLevel,
          [lastTestName]: Date.now()
        },
        { incrementModif: true }
      )
      .then(() => {
        // @ts-ignore
        setState({
          ...state,
          showAnswer: true,
          currentCompleted: true
        });
      });
  };

  if (state.loading)
    return (
      <Body>
        <Spinner />
      </Body>
    );

  if (state.list.length === 0 || state.current >= state.list.length) {
    return (
      <Body>
        <NonIdealState
          icon={<Icon icon="endorsed" intent={Intent.SUCCESS} iconSize={60} />}
          title="Good! This test is completed."
          description={<a onClick={refresh}>refresh</a>}
        />
      </Body>
    );
  }

  function contents(keys) {
    return keys.map(key => {
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
    });
  }

  function showAnswer() {
    setState({ ...state, showAnswer: true });
  }
  function next() {
    setState(state => {
      if (!state.currentCompleted) return state;
      return {
        ...state,
        showAnswer: false,
        current: ++state.current,
        currentCompleted: false
      };
    });
  }

  return (
    <Body>
      <div className={state.loading ? "bp3-skeleton" : ""}>
        {state.current} / {state.list.length}
      </div>
      <Card interactive elevation={2} style={{ width: "100%", minHeight: 500 }}>
        <div className="cardcontent" style={{ minHeight: 350 }}>
          <div>
            <Icon icon="tag" />
            {currentCard.tags.map(text => (
              <Tag minimal title={text} style={{ marginLeft: 5 }} />
            ))}
          </div>
          {contents(defaultView)}
          {state.showAnswer && [
            <MenuDivider />,
            contents(
              ["front", "back", "picture"].filter(
                key => !defaultView.includes(key)
              )
            )
          ]}
        </div>
        {!state.showAnswer && (
          <Button fill large onClick={showAnswer}>
            Show Answer
          </Button>
        )}

        {type === "spell" && !state.currentCompleted && (
          <InputGroup
            style={{ marginTop: 15 }}
            placeholder="input the word spell..."
            autoFocus
            onKeyDown={e => {
              e.stopPropagation();
              if (e.keyCode === 13) {
                const value = (e.target as HTMLInputElement).value;
                if (currentCard.front === value) {
                  Toaster.create().show({
                    message: "Perfect",
                    intent: Intent.SUCCESS
                  });
                  _onClick(3)();
                } else {
                  Toaster.create().show({
                    message: "word not correct",
                    intent: Intent.WARNING
                  });
                }
              }
            }}
          />
        )}

        <div style={{ padding: "15px 0 0" }}>
          {state.currentCompleted ? (
            <Button rightIcon="arrow-right" fill large onClick={next}>
              Next
            </Button>
          ) : (
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
          )}
        </div>
      </Card>
      <div style={{ textAlign: "right" }}>
        <span style={{ color: Colors.LIGHT_GRAY1 }} onClick={_onClick(4)}>
          Don't show it again.
        </span>
      </div>
    </Body>
  );
}

function registerHotKeyboard(callback) {
  const listner = function(e: KeyboardEvent) {
    callback(e);
  };
  window.addEventListener("keydown", listner);

  return function() {
    window.removeEventListener("keydown", listner);
  };
}
