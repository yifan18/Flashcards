import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Button,
  Icon,
  ButtonGroup,
  Intent,
  Checkbox,
  RadioGroup,
  Radio,
  Classes,
  InputGroup
} from "@blueprintjs/core";
import BooleanTrigger from "./boolean-trigger";
import { CardEdit } from "./card-edit";
import { playAudio } from "./utils";
import { api } from "./api";


export function Cards() {
  const [state, setState] = useState({
    list: [],
    showBack: false,
    loading: true,
    backIds: [],
    keyword: ""
  });
  const _setState = (newState) => {
    Object.assign(state, newState);
    setState({ ...state, ...newState });
  };
  const refresh = () => {
    let pattern = { };
    if (state.keyword) {
      pattern = { ...pattern, $or: [{ front: { $regex: state.keyword } }, { back: { $regex: state.keyword } }] }
    }
    // return cardStore.query(findfn).then(list => _setState({ ...state, list }));
    return api('card/list', 'post', {
      ql: pattern
    }).then(list => _setState({ ...state, list }))
  };

  useEffect(function () {
    Promise.all([
      refresh(),
      api('setting/list', 'post', { ql: { id: 'default_cards_view' } }).then(list => {
        _setState({ ...state, showBack: list[0].value === "back" });
      })
      // settingStore.queryById("default_cards_view").then(({ value }) => {
      //   _setState({ ...state, showBack: value === "back" });
      // })
    ]).then(() => {
      _setState({ loading: false });
    });
  }, []);

  if (state.loading) return null;

  return (
    <>
      <div>
        <BooleanTrigger destroyOnClose>
          <Button intent="primary" icon="add" large>
            New Card
          </Button>
          <CardEdit
            onSubmit={values => {
              return api('card/add', 'post', {
                front: values.front,
                back: values.back,
                picture: values.picture,
                tags: values.tags,
                readLevel: 1,
                spellLevel: 1,
                recallLevel: 1
              }).then(refresh)
            }
            }
          />
        </BooleanTrigger>

        <RadioGroup
          selectedValue={state.showBack}
          inline
          style={{ float: "right" }}
          onChange={e => {
            const value = e.target.value === "true";
            return api('setting/modify', 'post', {
              id: "default_cards_view",
              value: value ? "back" : "front"
            }).then(() => {
              _setState({ showBack: value, backIds: [] });
            });
          }}
        >
          <Radio large value={false}>
            front
          </Radio>
          <Radio large value={true}>
            back
          </Radio>
        </RadioGroup>

        <div style={{ margin: "10px 0 25px" }}>
          <InputGroup
            className={Classes.ROUND}
            leftIcon="search"
            placeholder="Search..."
            large
            autoFocus
            onKeyDown={e => {
              if (e.keyCode === 13) {
                const value = e.target.value.trim();
                _setState({ keyword: value });
                refresh()
              }
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <FlowLayout>
          {state.list.map(record => (
            <Card
              {...record}
              onReload={refresh}
              showBack={
                state.showBack
                  ? !~state.backIds.indexOf(record.id)
                  : !!~state.backIds.indexOf(record.id)
              }
              onChange={value => {
                let _v = state.showBack
                  ? !(value === "back")
                  : value === "back";
                if (_v) {
                  _setState({ backIds: state.backIds.concat(record.id) });
                } else {
                  _setState({
                    backIds: state.backIds.filter(id => id !== record.id)
                  });
                }
              }}
            />
          ))}
        </FlowLayout>
      </div>
    </>
  );
}

function FlowLayout({ children }) {
  const column = 3;
  const lists = [];
  React.Children.map(children, function (node, i) {
    let arr = lists[i % column];
    if (!arr) {
      arr = lists[i % column] = [];
    }
    arr.push(node);
  });
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {Array.from({ length: column }).map((r, i) => {
        return (
          <div style={{ flexBasis: "31%", wordBreak: "break-all" }}>
            {lists[i]}
          </div>
        );
      })}
    </div>
  );
}

function Card({
  id,
  front,
  back,
  picture,
  tags,
  showBack,
  onReload,
  onChange
}) {
  const toggle = () => onChange(showBack ? "front" : "back");

  const text = showBack ? back : front;
  return (
    <div
      style={{
        padding: "35px 0 15px",
        marginBottom: 25,
        alignItems: "center",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: 310,
        borderRadius: "36px",
        boxShadow: "1px 3px 4px rgb(183, 183, 183)",
        background: "rgb(248,244,238)",
        border: "2px solid rgb(234,93,48)"
      }}
    >
      <img
        src={picture || require("./images/noimage.png")}
        style={{ height: 120, maxWidth: "100%", borderRadius: "26px" }}
      />
      <div
        style={{
          fontSize: computeFontSize(
            { maxWidth: 220, symbolSize: 36, symbolWidth: 21 },
            text
          ),
          fontWeight: showBack ? "normal" : "bold",
          lineHeight: "28px",
          marginTop: 20,
          fontFamily: "monospace",
          cursor: "pointer",
          width: "100%",
          textAlign: "center",
          position: "relative"
        }}
        onClick={toggle}
      >
        {text}
        <span
          style={{
            width: 12,
            height: 16,
            border: "2px solid rgb(234,93,48)",
            borderRadius: "4px",
            position: "absolute",
            top: 0,
            bottom: 0,
            margin: "auto 0",
            background: showBack ? "rgb(234,93,48)" : undefined
          }}
          title={showBack ? "back" : "front"}
        ></span>
      </div>
      <div
        style={{
          marginTop: 15,
          display: "flex",
          width: "100%",
          padding: "0 10px"
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <Button
            minimal
            icon={"tag"}
            title={tags.toString()}
            text={tags.toString()}
            intent={Intent.WARNING}
            disabled
          />
        </div>
        <div>
          <ButtonGroup minimal>
            <Button
              icon="volume-up"
              onClick={() => playAudio({ text: text })}
              intent={Intent.WARNING}
            ></Button>

            <BooleanTrigger destroyOnClose>
              <Button icon="edit" intent={Intent.WARNING}></Button>
              <CardEdit
                isEdit
                value={{ front, back, picture, tags }}
                onSubmit={values => {
                  return api('card/modify', 'post', {
                    id,
                    front: values.front,
                    back: values.back,
                    picture: values.picture,
                    tags: values.tags
                  }).then(onReload)
                }
                }
              />
            </BooleanTrigger>

            <Button
              icon="delete"
              onClick={() => {
                return api('card/delete', 'get', {
                  id
                }).then(onReload)
              }}
              intent={Intent.WARNING}
            ></Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

function computeFontSize({ maxWidth, symbolSize, symbolWidth }, text) {
  // 12px 7.2
  // 36px 21
  const len = text.length;
  if (symbolWidth * len < maxWidth) return symbolSize;
  return parseInt((maxWidth / len) * (symbolSize / symbolWidth));
}
