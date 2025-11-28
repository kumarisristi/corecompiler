"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codelearn';
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferMaxEntries: 0,
            bufferCommands: false,
        };
        await mongoose_1.default.connect(mongoUri, options);
        logger_1.logger.info('✅ MongoDB connected successfully');
        mongoose_1.default.connection.on('connected', () => {
            logger_1.logger.info('Mongoose connected to MongoDB');
        });
        mongoose_1.default.connection.on('error', (err) => {
            logger_1.logger.error('Mongoose connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.logger.warn('Mongoose disconnected');
        });
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            logger_1.logger.info('MongoDB connection closed through app termination');
            process.exit(0);
        });
    }
    catch (error) {
        logger_1.logger.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.connection.close();
        logger_1.logger.info('✅ MongoDB disconnected successfully');
    }
    catch (error) {
        logger_1.logger.error('❌ MongoDB disconnection failed:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
//# sourceMappingURL=database.js.map