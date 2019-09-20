export default {
	path: 		 process.env.SAML_PATH,
	callbackUrl: process.env.SAML_CALLBACK_URL,
	entryPoint:  process.env.SAML_ENTRY_POINT,
	issuer: 	 process.env.SAML_ISSUER,
	cert: 		 process.env.SAML_CERT
}