// @flow

// nacl module
import { secretbox, randomBytes } from 'tweetnacl';

// Keychain module
import * as Keychain from 'react-native-keychain';

// Crypto
import { SHA256, PaperKey } from '@libs/crypto';

// utils
import { Base64, TextEncoding } from '@libs/utils';

// constant
type VaultEntry = { nonce: string, vault: string };
type KeychainData = { username: string, password: string };

export const Vault = {
    // Generate Secret Vault for storing the seed
    create: async (paperKeys: string, password: string): boolean => {
        const keyUnit8 = SHA256(password);
        const seedHexUnit8 = TextEncoding.toUnit8(PaperKey.toSeedHex(paperKeys));
        const nonce = await randomBytes(secretbox.nonceLength);
        const vault = await secretbox(seedHexUnit8, nonce, keyUnit8);

        // eslint-disable-next-line no-return-await
        return await Vault.save('seed', {
            nonce: Base64.encode(nonce),
            vault: Base64.encode(vault),
        });
    },

    // Store Secret Box in keychain under hashed password
    save: async (type: string, entry: VaultEntry): boolean => {
        await Keychain.setInternetCredentials(type, entry.nonce, entry.vault).then((): boolean => true);
    },

    // Retrieve Vault & Nonce from keychain
    retrieve: async (type: string): KeychainData | boolean =>
        // eslint-disable-next-line no-return-await
        await Keychain.getInternetCredentials(type)
            .then((data: KeychainData): KeychainData | boolean => {
                if (!data) {
                    return false;
                }
                return data;
            })
            .catch((error: string): boolean => {
                console.error('Keychain could not be accessed! Maybe no value set?', error);
                return false;
            }),

    // Use password to open Vault
    open: async (type: string, password: string): string => {
        const encPassword = SHA256(password);
        const EncVault = await Vault.retrieve(type);
        const seed = await secretbox.open(
            Base64.decode(EncVault.password),
            Base64.decode(EncVault.username),
            encPassword,
        );
        if (!seed) {
            return false;
        }
        return TextEncoding.toString(seed);
    },

    // Delete Vault & Nonce from keychain
    purge: (type: string) => {
        Keychain.resetInternetCredentials(type);
    },
};
