const jwt = require( 'jsonwebtoken');
const fs = require( 'fs');
const path = require( 'path');
const express = require('express');

const app = express();
app.use(express.json());


// Função para gerar o JWT
function generateJwt(privateKeyData) {

    const privateKey = Buffer(privateKeyData, 'base64').toString('utf8');
    // Cabeçalho do JWT
    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };

    // Payload do JWT
    const payload = {
        jti: '835e1f4f-6689-46a5-bd65-8e189fa23b0b',
        sub: "bmp.digital.api.featbank_consig_priv",
        iat: Math.floor(Date.now() / 1000), // Hora atual em segundos
        nbf: Math.floor(Date.now() / 1000), // Hora atual em segundos
        exp: Math.floor(Date.now() / 1000) + 3600, // Expira em 1 hora
        iss: "bmp.digital.api.featbank_consig_priv",
        aud: 'https://auth.moneyp.dev.br/connect/token'
    };

    // Assinatura do JWT
    const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        header: header
    });

    return token;
}


app.post('/generate-token', (req, res) => {
    if(!req?.body?.privateKeyData || req?.body?.privateKeyData === '') {
        return res.status(400).json({ message: 'privateKeyData is required'})
    }
    const token = generateJwt(req.body.privateKeyData)
    return res.status(200).json({ token });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})