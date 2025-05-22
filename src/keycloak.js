import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8081/",
  realm: "guitar-education",
  clientId: "gitar-backend", 
});

export default keycloak;