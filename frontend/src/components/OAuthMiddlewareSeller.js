import React, { useEffect } from "react";
import axios from "axios";

export default function OAuthMiddlewareSeller() {
  const token = new URLSearchParams(window.location.hash.substring(1)).get(
    "access_token"
  );
  if (!token) {
    sessionStorage.clear();
    alert("Authentication failed!");
    window.location.replace("/sellerlogin");
  }
  useEffect(() => {
    // Fetch user info using the access token
    axios
      .get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
      )
      .then((response) => {
        const sellerEmail = response.data.email;
        // Set session storage items
        sessionStorage.setItem("sAyurCenRelles", Math.random().toString());
        sessionStorage.setItem("sellerEmail", sellerEmail);
        // Redirect to buyer home after successful login
        window.location.replace(`/sellerhome`);
      })
      .catch((error) => {
        console.error("Failed to fetch user info:", error);
        alert("Failed to log in with Google.");
      });
  });
  return <></>;
}
