"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'your-access-token-secret';
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';
// Function to generate Access Token
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};
exports.generateAccessToken = generateAccessToken;
// Function to generate Refresh Token
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
// Function to verify Access Token
const verifyAccessToken = (token) => {
    try {
        // jwt.verify() returns the decoded payload, which we cast to JwtPayload
        const decoded = jsonwebtoken_1.default.verify(token, JWT_ACCESS_TOKEN_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid or expired access token');
    }
};
exports.verifyAccessToken = verifyAccessToken;
// Function to verify Refresh Token
const verifyRefreshToken = (token) => {
    try {
        // jwt.verify() returns the decoded payload, which we cast to JwtPayload
        const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_TOKEN_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const authenticateToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        // Early return without returning the response itself to maintain void return type
        res.status(403).json({ message: 'No token provided' });
        return; // End the function execution after sending the response
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Unauthorized' });
            return; // End the function execution after sending the response
        }
        req.user = { id: decoded.id }; // Save user ID to request object
        next(); // Proceed to the next middleware or route handler
    });
};
exports.authenticateToken = authenticateToken;
