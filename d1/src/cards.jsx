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
  TagInput,
  TextArea,
  Toaster
} from "@blueprintjs/core";
import { createStoreConnect, STORE_CARD } from "./db";
import BooleanTrigger from "./boolean-trigger";

const cardStore = createStoreConnect(STORE_CARD);

export function Cards() {
  const [state, setState] = useState({ list: [] });
  const refresh = () => cardStore.query().then(list => setState({ list }));

  useEffect(function() {
    refresh();
  }, []);

  return (
    <>
      <div>
        <BooleanTrigger destroyOnClose>
          <Button intent="primary" icon="add">
            New Card
          </Button>
          <CardEdit
            onSubmit={values =>
              cardStore
                .add({
                  front: values.front,
                  back: values.back,
                  pictures: values.pictures,
                  tags: values.tags,
                  readLevel: 0,
                  spellLevel: 0,
                  recallLevel: 0
                })
                .then(refresh)
            }
          />
        </BooleanTrigger>
      </div>
      <div style={{marginTop: 12}}>
        <table className="bp3-html-table" style={{width: '100%'}}>
          <thead>
            <tr>
              <th>Front</th>
              <th>Back</th>
              <th>Picture</th>
              <th>Tags</th>
              <th>Read Level</th>
              <th>Spell Level</th>
              <th>Recall Level</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {state.list.map(
              ({
                id,
                front,
                back,
                pictures,
                tags,
                readLevel,
                spellLevel,
                recallLevel
              }) => (
                <tr key={id}>
                  <td>{front}</td>
                  <td>{back}</td>
                  <td>{pictures ? <img src={pictures} /> : false}</td>
                  <td>{tags}</td>
                  <td>{readLevel}</td>
                  <td>{spellLevel}</td>
                  <td>{recallLevel}</td>
                  <td>
                    <BooleanTrigger destroyOnClose>
                      <Button
                        small
                        minimal
                        icon="edit"
                        style={{ marginRight: 5 }}
                      />
                      <CardEdit
                        isEdit
                        value={{ front, back, pictures: pictures, tags }}
                        onSubmit={values =>
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
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const CardEdit = createForm()(function CardEditor({
  value,
  isEdit,
  visible,
  onSubmit,
  onOk,
  onCancel,
  form
}) {
  const [state, setState] = useState({ loading: false });
  const url = form.getFieldValue("pictures");
  const contentStyle = { width: "100%" };

  const _onSubmit = () => {
    form.validateFields((err, values) => {
      if (err) return;

      setState({ loading: true });
      onSubmit(values)
        .then(() => {
          setState({ loading: false });
          Toaster.create({
            intent: Intent.SUCCESS,
            message: "Saved!"
          });

          if (isEdit) {
            return onOk();
          }
          // 清空
          form.setFieldsValue({
            front: "",
            back: "",
            pictures: "",
            tags: []
          });
        })
        .catch(error => {
          console.error(error);
          setState({ loading: false });
        });
    });
  };

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
          {isEdit ? (
            <Button
              intent={Intent.SUCCESS}
              loading={state.loading}
              onClick={_onSubmit}
            >
              Save
            </Button>
          ) : (
            <Button
              rightIcon="arrow-right"
              intent={Intent.SUCCESS}
              loading={state.loading}
              onClick={_onSubmit}
            >
              Save & Next
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
});
