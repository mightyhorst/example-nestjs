export default {
	path: 		 	 process.env.SAML_PATH,
	callbackUrl: 	 process.env.SAML_CALLBACK_URL,
	entryPoint:  	 process.env.SAML_ENTRY_POINT,
	issuer: 	 	 process.env.SAML_ISSUER,
	cert: 		 	 process.env.SAML_CERT,
	failureRedirect: process.env.SAML_FAILURE_URL,
	groupWhitelist: [
		// Principals
		'CN=SCHOOL.PRINCIPAL,OU=Groups,OU=Portal,OU=Services,DC=devdetnsw,DC=win',
		'CN=SCHOOL.PRINCIPAL,OU=Groups,OU=Portal,OU=Services,DC=uatdetnsw,DC=win',
		'CN=SCHOOL.PRINCIPAL,OU=Groups,OU=Portal,OU=Services,DC=DETNSW,DC=win',

		// Central Ave
		'CN=@Central Ave - All Staff,OU=Central Groups,OU=Auto,OU=Groups,OU=Corporate Offices,DC=devdetnsw,DC=win',
		'CN=@Central Ave - All Staff,OU=Central Groups,OU=Auto,OU=Groups,OU=Corporate Offices,DC=uatdetnsw,DC=win',
		'CN=@Central Ave - All Staff,OU=Central Groups,OU=Auto,OU=Groups,OU=Corporate Offices,DC=DETNSW,DC=WIN',

		// In DEV, we can be a teacher
		'CN=SCHOOL.TEACHER,OU=Groups,OU=Portal,OU=Services,DC=DEVDETNSW,DC=WIN',
	]
}
