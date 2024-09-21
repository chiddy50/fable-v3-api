import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const useConfig = () => {

    if (!process.env.APP_PORT) {
        throw new Error('Missing PORT environment variable');
    }

    if (!process.env.CODE_WALLET_DEPOSIT_ADDRESS) {
        throw new Error('Missing CODE_WALLET_DEPOSIT_ADDRESS environment variable');
    }

    if (!process.env.WEBHOOK_URL) {
        throw new Error('Missing WEBHOOK_URL environment variable');
    }

    if (!process.env.CODE_SEQUENCER_PUBLIC_KEY) {
        throw new Error('Missing CODE_SEQUENCER_PUBLIC_KEY environment variable');
    }

    const config = {
        port: parseInt(process.env.APP_PORT, 3300),
        storeAccount: process.env.CODE_WALLET_DEPOSIT_ADDRESS,
        webhookURL: process.env.WEBHOOK_URL,
        codeSequencerPublicKey: process.env.CODE_SEQUENCER_PUBLIC_KEY,
    };

    return config;
};