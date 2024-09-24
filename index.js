const jwt = require( 'jsonwebtoken');
const express = require('express');

const app = express();
app.use(express.json());


// Função para gerar o JWT
function generateJwt(privateKeyData) {

    const privateKey = Buffer(privateKeyData, 'base64').toString('utf8');
    // Cabeçalho do JWT
    const header = {
        alg: process.env.JWT_ALGORITHM,
        typ: process.env.JWT_TYPE
    };

    // Payload do JWT
    const payload = {
        jti: process.env.JWT_JTI,
        sub: process.env.JWT_SUB,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        iss: process.env.JWT_ISS,
        aud: process.env.JWT_AUD,
    };

    // Assinatura do JWT
    const token = jwt.sign(payload, privateKey, {
        algorithm: process.env.JWT_ALGORITHM,
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

app.listen(Number(process.env.PORT), () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})