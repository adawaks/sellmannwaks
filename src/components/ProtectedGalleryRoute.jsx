import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedGalleryRoute({ children }) {
  const hasAccess =
    sessionStorage.getItem("galleryAccess") === "granted";

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
}