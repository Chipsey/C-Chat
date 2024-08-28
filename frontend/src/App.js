import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
