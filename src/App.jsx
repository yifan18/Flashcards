import React, { useState, useEffect } from "react";
import "./App.css";
import { createForm } from "rc-form";
import {
  FormGroup,
  InputGroup,
  Button,
  Dialog,
  Classes,
  Intent,
  EditableText,
  TagInput,
  TextArea,
  FileInput,
  Icon
} from "@blueprintjs/core";
import { createStoreConnect, STORE_CARD } from "./db";
import BooleanTrigger from "./boolean-trigger";

const cardStore = createStoreConnect(STORE_CARD);

function App() {
  const [state, setState] = useState({ list: [] });
  const refresh = () => cardStore.query().then(list => setState({ list }));

  useEffect(function() {
    console.log("didmount");
    refresh();
  }, []);

  return (
    <div style={{ padding: 12 }}>
      <h1>Cards</h1>
      <div>
        <BooleanTrigger destroyOnClose>
          <Button intent="primary" icon="add">
            New Card
          </Button>
          <WordEdit
            onOk={(values, haveNext) => {
              cardStore
                .add({
                  front: values.front,
                  back: values.back,
                  pictures: values.pictures,
                  tags: values.tags
                })
                .then(refresh);
              return haveNext;
            }}
          />
        </BooleanTrigger>
      </div>
      <div>
        <table className="bp3-html-table">
          <thead>
            <tr>
              <th>front</th>
              <th>back</th>
              <th>picture</th>
              <th>tags</th>
              <th>option</th>
            </tr>
          </thead>
          <tbody>
            {state.list.map(({ id, front, back, pictures, tags }) => (
              <tr key={id}>
                <td>{front}</td>
                <td>{back}</td>
                <td>{pictures ? <img src={pictures} /> : false}</td>
                <td>{tags}</td>
                <td>
                  <BooleanTrigger destroyOnClose>
                    <Button
                      small
                      minimal
                      icon="edit"
                      style={{ marginRight: 5 }}
                    />
                    <WordEdit
                      isEdit
                      value={{ front, back, pictures: pictures, tags }}
                      onOk={values =>
                        cardStore
                          .modify(
                            {
                              id,
                              front: values.front,
                              back: values.back,
                              pictures: values.pictures,
                              tags: values.tags
                            },
                            {
                              incrementModif: true
                            }
                          )
                          .then(refresh)
                      }
                    />
                  </BooleanTrigger>
                  <Button
                    small
                    minimal
                    icon="remove"
                    onClick={() => cardStore.delete(id).then(refresh)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const WordEdit = createForm()(function WordEdit({
  value,
  isEdit,
  visible,
  onOk,
  onCancel,
  form
}) {
  const url = form.getFieldValue("pictures");
  const contentStyle = { width: "100%" };

  useEffect(function() {
    isEdit && form.setFieldsValue(value);
  }, []);
  return (
    <Dialog
      isOpen={visible}
      title={isEdit ? "Edit Card" : "New Card"}
      onClose={onCancel}
    >
      <div className={Classes.DIALOG_BODY}>
        <FormGroup label="front" labelInfo="*">
          {form.getFieldDecorator("front", {
            rules: [{ required: true, message: "please input" }]
          })(<TextArea style={contentStyle} />)}
        </FormGroup>
        <FormGroup label="back" labelInfo="*">
          {form.getFieldDecorator("back", {
            rules: [{ required: true, message: "please input" }]
          })(<TextArea style={contentStyle} />)}
        </FormGroup>
        <img src={url} />
        <FormGroup label="picture">
          {form.getFieldDecorator("pictures", {})(
            <InputGroup placeholder="image url" />
          )}
        </FormGroup>
        <FormGroup label="tags">
          {form.getFieldDecorator("tags", {
            initialValue: [],
            valuePropName: "values"
          })(<TagInput />)}
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            rightIcon="arrow-right"
            intent={Intent.SUCCESS}
            onClick={() => {
              form.validateFields((err, values) => {
                if (err) return;
                onOk(values, false);
                form.resetFields()
              });
            }}
          >
            Save & Next
          </Button>
        </div>
      </div>
    </Dialog>
  );
});

export default App;
