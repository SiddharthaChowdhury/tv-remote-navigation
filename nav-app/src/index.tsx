import { h, render } from "preact";
import App from "./demo/App";

const root = document.getElementById("app");
if (root) {
  render(<App />, root);
}
