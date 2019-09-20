export default {
	httpsEnabled: process.env.HTTPS_ENABLED || false, 
    key: process.env.SSL_KEY || null,
    cert: process.env.SSL_CERT || null
}