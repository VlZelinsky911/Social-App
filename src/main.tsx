import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { store } from "./app/store/store.ts";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
