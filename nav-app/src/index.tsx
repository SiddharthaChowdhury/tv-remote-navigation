import { h, render } from "preact";
import App from "./sample/App";

const root = document.getElementById("app");
if (root) {
  render(<App />, root);
}
