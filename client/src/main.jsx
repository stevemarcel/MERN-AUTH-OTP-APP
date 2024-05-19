// Dependencies Import
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store.js";
import { Provider } from "react-redux";

// App Related Import
import App from "./App.jsx";
import "./index.css";

// Pages Import
//? import RegisterPage from "./assets/test/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import ConfirmEmailPage from "./pages/ConfirmEmailPage.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/confirm-email/:id" element={<ConfirmEmailPage />} />
      <Route path="/:id/verifyemail/:token" element={<VerifyEmail />} />
      <Route path="*" element={<ErrorPage />} />

      {/* Private Routes */}
      {/* <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route> */}
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
