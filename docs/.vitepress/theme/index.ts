import DefaultTheme from "vitepress/theme";
import BookTree from "./components/BookTree.vue";
import ZedLayout from "./ZedLayout.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout: ZedLayout,
  enhanceApp({ app }) {
    app.component("BookTree", BookTree);
  },
};
