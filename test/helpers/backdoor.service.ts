const axios = require('axios');
export async function getToken(){
	return axios.get('http://localhost:3000/auth/saml/backdoor?json=true')
		.then(res =>{
			return res.data.token
		})
}

