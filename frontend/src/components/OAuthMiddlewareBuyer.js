import React, { useEffect } from "react";
import axios from "axios";

export default function OAuthMiddlewareBuyer() {
  const token = new URLSearchParams(window.location.hash.substring(1)).get(
    "access_token"
  );
  if (!token) {
    sessionStorage.clear();
    alert("Authentication failed!");
    window.location.replace("/buyerlogin");
  }
  useEffect(() => {
    // Fetch user info using the access token
    axios
      .get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
      )
      .then((response) => {
        const buyerEmail = response.data.email;
        // Set session storage items
        sessionStorage.setItem("sAyurCenReyub", Math.random().toString());
        sessionStorage.setItem("buyerEmail", buyerEmail);
        // Redirect to buyer home after successful login
        window.location.replace(`/buyerhome`);
      })
      .catch((error) => {
        console.error("Failed to fetch user info:", error);
        alert("Failed to log in with Google.");
      });
  });
  return <></>;
}
