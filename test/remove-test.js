const re = /^import ['|"].+$/gmi;

const text = `
import App from "./_snowpack/pkg/fusion-react.js";
import DefaultRoot from "./components/fusion-root.js";
import "./_snowpack/pkg/fusion-core.js";
import "./plugins/time.js";
function start(root, render) {
  const el = root || DefaultRoot;
  return new App(el, render);
}
export {
  start as default
};
//# sourceMappingURL=main.js.map
`;

console.log(
  text.replace(re, '')
)