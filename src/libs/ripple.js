// @flow
import has from 'lodash/has';

import { generateSeed, deriveKeypair, deriveAddress } from 'ripple-keypairs';

import { isValidAddress as _isValidAddress, isValidSeed as _isValidSeed } from 'ripple-address-codec';

// Todo: Air Gapped transaction

const getKeyPairsFromSecret = (secret: string) => {
    const { publicKey } = deriveKeypair(secret);
    const address = deriveAddress(publicKey);

    return {
        address,
        publicKey,
        secret,
    };
};

const getKeyPairsFromSeed = (seed: Array) => {
    const entropy = Array.from(seed);
    const secret = generateSeed({ entropy });
    const { publicKey } = deriveKeypair(secret);
    const address = deriveAddress(publicKey);

    return {
        address,
        publicKey,
        secret,
    };
};

const getTransaction = (txID: string) => global.api.getTransaction(txID);

const getTransactions = async (account, extraOptions) =>
    global.api.getServerInfo().then(server => {
        const ledgers = server.completeLedgers.split('-');
        const firstLedger = parseInt(ledgers[0], 10);
        const lastLedger = parseInt(ledgers.reverse()[0], 10);

        let options = {
            types: ['payment'],
            ...extraOptions,
        };

        if (!has(extraOptions, 'start')) {
            options = {
                minLedgerVersion: firstLedger,
                maxLedgerVersion: lastLedger,
                ...options,
            };
        }

        return global.api.getTransactions(account, options);
    });

const getBalance = account => global.api.getBalances(account, { currency: 'XRP' });

const preparePayment = async (payment, instructions) =>
    // In here we need to check if we connected or not
    // Using in offline mode ??
    // eslint-disable-next-line no-return-await
    await global.api.preparePayment(payment.source.address, payment, instructions);


const signTransaction = async (preparedTransaction, secret) => {
    const { signedTransaction } = await global.api.sign(preparedTransaction, secret);
    return signedTransaction;
};

const submitTransaction = async signedTransaction => global.api.submit(signedTransaction);

const isValidAddress = address => _isValidAddress(address);

const isValidSeed = secret => _isValidSeed(secret);

export {
    getKeyPairsFromSecret,
    getKeyPairsFromSeed,
    getTransaction,
    getTransactions,
    getBalance,
    preparePayment,
    signTransaction,
    submitTransaction,
    isValidAddress,
    isValidSeed,
};
