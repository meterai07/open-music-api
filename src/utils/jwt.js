const Jwt = require('@hapi/jwt');

const generateAccessToken = (payload) => {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY, {
        ttlSec: process.env.ACCESS_TOKEN_AGE || 1800,
    });
};

const generateRefreshToken = () => {
    return Jwt.token.generate(process.env.REFRESH_TOKEN_KEY, {
        ttlSec: process.env.REFRESH_TOKEN_AGE || 1800,
    });
};

const verifyRefreshToken = (refreshToken) => {
    const artifacts = Jwt.token.decode(refreshToken);
    Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
    return artifacts.decoded.payload;
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
};