import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8081',
  realm: 'guitar-education',
  clientId: 'guitar-education-client'
});

export default keycloak;