import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import InversePrivateRoute from "./InversePrivateRoute";
import RegisterPage from "../pages/RegisterPage";
import ChatPage from "../pages/ChatPage";
import HomePage from "../pages/HomePage";
import Profile from "../components/profile";
// import FavoritesPage from "../pages/FavoritesPage"; // Assuming you have this page

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:recipient/:name"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <InversePrivateRoute>
              <LoginPage />
            </InversePrivateRoute>
          }
        />
        <Route
          path="/register"
          element={
            <InversePrivateRoute>
              <RegisterPage />
            </InversePrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
