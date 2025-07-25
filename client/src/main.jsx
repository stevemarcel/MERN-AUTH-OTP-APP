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
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import ConfirmEmailPage from "./pages/ConfirmEmailPage.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import UserListPage from "./pages/UserListPage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import UserEditPage from "./pages/UserEditPage.jsx";
import CreateNewUserPage from "./pages/CreateNewUserPage.jsx";
import DummyListPage from "./pages/DummyListPage.jsx";
import FeaturesPage from "./pages/FeaturesPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

// Components Import
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/confirm-email/:id" element={<ConfirmEmailPage />} />
      <Route path="/:id/verifyemail/:token" element={<VerifyEmail />} />
      <Route path="*" element={<ErrorPage />} />

      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />

        {/* Admin Routes */}
        <Route path="" element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/user/:userId/edit" element={<UserEditPage />} />
          <Route path="/admin/user/:userId/create" element={<CreateNewUserPage />} />
          <Route path="/admin/products" element={<ProductListPage />} />
          <Route path="/admin/dummyitems" element={<DummyListPage />} />
        </Route>
      </Route>
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
