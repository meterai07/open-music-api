const Jwt = require('@hapi/jwt');

const generateAccessToken = (payload) => {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY, {
        ttlSec: 1800,
    });
};

const generateRefreshToken = (payload) => {
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY, {
        ttlSec: process.env.REFRESH_TOKEN_TTL,
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