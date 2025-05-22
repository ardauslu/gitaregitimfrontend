import React from "react";
import keycloak from "./keycloak";

const Signup = () => {
  const handleKeycloakRegister = () => {
    keycloak.register({
      redirectUri: "http://localhost:3000/home"
    });
  };

  return (
    <div className="signup-page">
      <button className="signup-button" onClick={handleKeycloakRegister}>
        Keycloak ile Kayıt Ol
      </button>
    </div>
  );
};

export default Signup;