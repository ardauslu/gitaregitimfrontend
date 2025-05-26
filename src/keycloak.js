import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://keycloak.bishokudev.com/",
  realm: "guitar-education",
  clientId: "gitar-backend",
});
export default keycloak;