import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import { userContextData } from "./context/UserContext.jsx";
import Network from "./components/Network.jsx";
import Profile from "./components/Profile.jsx";
import ViewPost from "./components/ViewPost";
import Notification from "./components/Notification.jsx";

const App = () => {

  const { userData, loading } = useContext(userContextData);

  // Don't render routes until we know the user's login status
  if (loading) {
    return <div>...</div>;
  }

  return (
    <Routes>

      <Route
        path="/"
        element={
          userData
            ? <Home />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/login"
        element={
          userData
            ? <Navigate to="/" replace />
            : <Login />
        }
      />

      <Route
        path="/signup"
        element={
          userData
            ? <Navigate to="/" replace />
            : <Signup />
        }
      />

      <Route
        path="/network"
        element={
          userData
            ? <Network />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/profile"
        element={
          userData
            ? <Profile />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/profile/:userId"
        element={
          userData
            ? <Profile />
            : <Navigate to="/login" replace />
        }
      />

      <Route path="/post/:postId" element={userData ? <ViewPost /> : <Navigate to="/login" replace />} />

      <Route path="/notification" element={userData ? <Notification /> : <Navigate to="/login" replace />} />

    </Routes>
  );
};

export default App;