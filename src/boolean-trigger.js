import React from "react";

export default class BooleanTrigger extends React.Component {
  // static propTypes = {
  //   children: PropTypes.element.isRequired,
  //   onOkName: PropTypes.string,
  //   onCancelName: PropTypes.string,
  //   actionName: PropTypes.string,
  //   booleanPropName: PropTypes.string,
  //   destroyOnClose: PropTypes.bool,
  //   renderMode: PropTypes.oneOf(["default", "lazy"])
  // };

  static defaultProps = {
    actionName: "onClick",
    onOkName: "onOk",
    onCancelName: "onCancel",
    booleanPropName: "visible",
    destroyOnClose: false,
    renderMode: "lazy"
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      renderModal: props.renderMode === "default"
    };
  }

  render() {
    const {
      children,
      actionName = "onClick",
      onOkName = "onOk",
      onCancelName = "onCancel",
      booleanPropName = "visible"
    } = this.props;
    const { visible, renderModal } = this.state;

    const subComponents = React.Children.toArray(children);

    if (subComponents.length !== 2) {
      throw new Error(
        "BooleanTrigger必须包含两个儿子，第一个是触发元素，第二个是被触发元素！"
      );
    }

    const modalTrigger = subComponents[0],
      modal = subComponents[1];

    return (
      <React.Fragment>
        {React.cloneElement(modalTrigger, {
          [actionName]: (...args) => {
            const onClick = (modalTrigger.props || {})[actionName];
            this.runEvent(onClick, true, ...args);
          }
        })}
        {visible || renderModal
          ? React.cloneElement(modal, {
              [booleanPropName]: visible,
              [onCancelName]: (...args) => {
                const onCancel = (modal.props || {})[onCancelName];
                return this.runEvent(onCancel, false, ...args);
              },
              [onOkName]: (...args) => {
                const onOk = (modal.props || {})[onOkName];
                return this.runEvent(onOk, false, ...args);
              }
            })
          : null}
      </React.Fragment>
    );
  }

  isFirstModalRender = true;

  componentDidUpdate(prevProps, prevState, snapshot) {
    let { destroyOnClose = false, renderMode = "lazy" } = this.props;
    if (prevState.visible === true && this.state.visible === false) {
      // 兼容下以前写错的
      if ("destoryOnClose" in this.props)
        destroyOnClose = this.props["destoryOnClose"];
      if (destroyOnClose) this.setState({ renderModal: false });
    }
    if (renderMode === "lazy") {
      if (prevState.visible === false && this.state.visible === true) {
        if (this.isFirstModalRender) {
          this.isFirstModalRender = false;
          this.setState({ renderModal: true });
        }
      }
    }
  }

  runEvent = (event, visible, ...args) => {
    if (typeof event === "function") {
      return runEvent(event, this.showModal.bind(this, visible), null, ...args);
    } else this.showModal(visible);
  };

  showModal = visible => {
    this.setState({ visible });
  };
}

function runEvent(event, success, error, ...args) {
  const response = event(...args);
  //返回false
  if (response === false) {
    if (error) error();
    return false;
  }
  // 返回promise，获取promise结果
  if (isPromise(response)) {
    return runPromise(response, success, error);
  }
  // 返回其他类型认为成功
  if (success) success();
  return response;
}

function runPromise(promise, success, error) {
  return new Promise((resolve, reject) => {
    promise
      .then(response => {
        if (success) success();
        resolve(response);
      })
      .catch(err => {
        if (error) error();
        reject(err);
      });
  });
}

function isPromise(promise) {
  return (
    promise &&
    typeof promise.then === "function" &&
    typeof promise.catch === "function"
  );
}
