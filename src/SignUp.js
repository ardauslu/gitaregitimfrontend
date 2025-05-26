import React from "react";
import keycloak from "./keycloak";
import config from "./config";

const Signup = () => {
  const handleKeycloakRegister = () => {
    keycloak.register({
      redirectUri: config.REGISTER_REDIRECT_URI
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