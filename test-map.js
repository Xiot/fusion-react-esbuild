var _s = $RefreshSig$(),
    _s2 = $RefreshSig$();

var __defProp = Object.defineProperty;

var __name = (target, value) => __defProp(target, "name", {
  value,
  configurable: true
});

import React, { useState, useEffect, useCallback } from "react";

const Counter = /* @__PURE__ */__name(_c = _s(props => {
  _s();

  const [value, setValue] = useState(0);
  useEffect(() => {
    const handle = setInterval(() => setValue(v => v + 1), 1e3);
    return () => clearInterval(handle);
  }, []);
  return /* @__PURE__ */React.createElement("div", {
    style: {
      display: "inline-block",
      color: "blue"
    }
  }, value);
}, "QEMGEmq5Rfwf2KLuWFF3dZYTA2c="), "Counter");

_c2 = Counter;

const ServerTime = /* @__PURE__ */__name(_c3 = _s2(() => {
  _s2();

  const [time, setTime] = useState(Date.now());
  const [status, setStatus] = useState("");
  const getTime = useCallback(() => {
    setStatus("calling");
    fetch("/time").then(x => x.json()).then(({
      time: time2
    }) => {
      setTime(time2);
      setStatus("success");
    }).catch(ex => {
      setStatus(`failed
${ex}`);
    });
  }, []);
  return /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("div", null, "Server Time: ", time), /* @__PURE__ */React.createElement("button", {
    onClick: getTime
  }, "refresh"), /* @__PURE__ */React.createElement("pre", null, status));
}, "61CTL4ojtIsIJEBecficM8BvwCA="), "ServerTime");

_c4 = ServerTime;

const Hello = /* @__PURE__ */__name(_c5 = props => {
  return /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("div", null, "Hello ", props.name), /* @__PURE__ */React.createElement("div", null, props.message), /* @__PURE__ */React.createElement("div", null, "Value: ", /* @__PURE__ */React.createElement(Counter, null)), /* @__PURE__ */React.createElement(ServerTime, null));
}, "Hello");

_c6 = Hello;
export { Hello };

var _c, _c2, _c3, _c4, _c5, _c6;

$RefreshReg$(_c, "Counter$__name");
$RefreshReg$(_c2, "Counter");
$RefreshReg$(_c3, "ServerTime$__name");
$RefreshReg$(_c4, "ServerTime");
$RefreshReg$(_c5, "Hello$__name");
$RefreshReg$(_c6, "Hello");