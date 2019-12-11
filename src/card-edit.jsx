import React, { useState, useEffect } from "react";
import "./App.css";
import { createForm } from "rc-form";
import {
  FormGroup,
  InputGroup,
  Button,
  ButtonGroup,
  Dialog,
  Classes,
  Intent,
  TagInput,
  TextArea,
  Toaster,
} from "@blueprintjs/core";
import {
  getGoogleSearchFirstImage,
  getGoogleSearchFirstImageUrl,
  playAudio,
  serviceGet
} from "./utils";

export const CardEdit = createForm()(function CardEditor({
  value,
  isEdit,
  visible,
  onSubmit,
  onOk,
  onCancel,
  form
}) {
  const [state, setState] = useState({ loading: false });
  const url = form.getFieldValue("picture");
  const contentStyle = { width: "100%" };

  const _onSubmit = () => {
    form.validateFields((err, values) => {
      if (err) return;

      setState({ loading: true });
      onSubmit(values)
        .then(() => {
          setState({ loading: false });

          if (isEdit) {
            Toaster.create().show({
              intent: Intent.SUCCESS,
              message: "Updated",
              icon: "tick"
            });
            return onOk();
          } else {
            Toaster.create().show({
              intent: Intent.SUCCESS,
              message: "Saved",
              icon: "tick"
            });
          }
          // 清空
          form.setFieldsValue({
            front: "",
            back: "",
            picture: "",
            tags: []
          });
        })
        .catch(error => {
          console.error(error);
          setState({ loading: false });
        });
    });
  };

  useEffect(function () {
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
          })(<InputGroup
            rightElement={
              <ButtonGroup minimal>
                <Button
                  icon="volume-up"
                  onClick={() => {
                    const word = form.getFieldValue("front") || "";
                    if (!word.trim()) return;
                    playAudio({ text: word })
                  }}
                />
              </ButtonGroup>
            }
          />
          )}
        </FormGroup>
        <FormGroup label="back" labelInfo="*">
          {form.getFieldDecorator("back", {
            rules: [{ required: true, message: "please input" }]
          })(<TextArea style={contentStyle} />)}
        </FormGroup>
        <img src={url} />
        <FormGroup label="picture">
          {form.getFieldDecorator("picture", {})(
            <InputGroup
              placeholder="image url"
              rightElement={
                <ButtonGroup minimal>
                  <Button
                    icon="image-rotate-left"
                    onClick={() => {
                      const word = form.getFieldValue("front") || "";
                      if (!word.trim()) return;
                      const url = `http://www.google.com/search?q=${word}&tbm=isch`;
                      serviceGet("/proxy?url=" + encodeURIComponent(url))
                        .then(res => res.text())
                        .then(text => {
                          const src =
                            getGoogleSearchFirstImage(text) ||
                            getGoogleSearchFirstImageUrl(text);
                          form.setFieldsValue({ picture: src });
                        });
                    }}
                  />
                  <Button
                    icon="media"
                    onClick={() => {
                      const word = form.getFieldValue("front") || "";
                      if (!word.trim()) return;
                      window.open(
                        `https://www.google.com/search?q=${word}&tbm=isch`,
                        "_blank"
                      );
                    }}
                  />
                </ButtonGroup>
              }
            />
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
        <Button
          icon="volume-up"
          onClick={() => {
            const word = form.getFieldValue("front") || "";
            if (!word.trim()) return;
            playAudio({ text: word })
          }}
        />
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
