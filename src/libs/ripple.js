// @flow
import has from 'lodash/has';

import bip32 from 'ripple-bip32';
import sign from 'ripple-sign-keypairs';

import { deriveKeypair, deriveAddress } from 'ripple-keypairs';

import { isValidAddress as _isValidAddress, isValidSeed as _isValidSeed } from 'ripple-address-codec';

const getKeyPairsFromSecret = (secret: string) => {
    const { publicKey, privateKey } = deriveKeypair(secret);
    const address = deriveAddress(publicKey);

    return {
        address,
        publicKey,
        privateKey,
    };
};

const getKeyPairsFromSeed = (seed: string) => {
    const m = bip32.fromSeedHex(seed);
    const { privateKey, publicKey } = m.derivePath("m/44'/144'/0'/0/0").keyPair.getKeyPairs();
    const address = deriveAddress(publicKey);

    return {
        address,
        publicKey,
        privateKey,
    };
};

const getTransaction = (txID: string) => global.api.getTransaction(txID);

const getTransactions = async (account, extraOptions) =>
    global.api.getServerInfo().then(server => {
        const ledgers = server.completeLedgers.split('-');
        const firstLedger = parseInt(ledgers[0], 10);

        let options = {
            types: ['payment'],
            ...extraOptions,
        };

        if (!has(extraOptions, 'start')) {
            options = {
                minLedgerVersion: firstLedger,
                ...options,
            };
        }

        return global.api.getTransactions(account, options);
    });

const getBalance = account => global.api.getBalances(account, { currency: 'XRP' });

// Todo: Air Gapped transaction
const preparePayment = async (payment, instructions) =>
    // In here we need to check if we connected or not
    // Using in offline mode ??
    // eslint-disable-next-line no-return-await
    await global.api.preparePayment(payment.source.address, payment, instructions);


const signTransaction = async (preparedTransaction, keyPairs) => {
    const { signedTransaction } = await sign(preparedTransaction, keyPairs);
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
