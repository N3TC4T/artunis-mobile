// @flow

// crypto
import sjcl from 'sjcl';
import { secretbox, randomBytes } from 'tweetnacl';

// utils
import bip39 from 'bip39';
import { TextEncoding, Base64 } from '@libs/utils/';
import DeviceInfo from 'react-native-device-info';

// Constant
const deviceId = DeviceInfo.getUniqueID();

/* Crypt ==================================================================== */
const SHA256 = (entry: string): Array => {
    const ENC = sjcl.hash.sha256.hash(entry);
    return Base64.decode(sjcl.codec.base64.fromBits(ENC));
};


/* Secret ==================================================================== */
const Secret = {
    encrypt: async (entry: string, seed: string): string => {
        const seedMD5Unit8 = SHA256(seed);
        const nonce = randomBytes(secretbox.nonceLength);
        const entryUint8 = TextEncoding.toUnit8(entry);
        const box = await secretbox(entryUint8, nonce, seedMD5Unit8);

        const encSecret = new Uint8Array(nonce.length + box.length);
        encSecret.set(nonce);
        encSecret.set(box, nonce.length);

        return Base64.encode(encSecret);
    },

    decrypt: async (box: string, seed: string): string => {
        const seedMD5Unit8 = SHA256(seed);
        const boxUint8 = Base64.decode(box);
        const nonce = new Uint8Array(Array.prototype.slice.call(boxUint8, 0, secretbox.nonceLength));
        const message = new Uint8Array(Array.prototype.slice.call(boxUint8, secretbox.nonceLength, box.length));


        const plainSecret = secretbox.open(message, nonce, seedMD5Unit8);

        if (!plainSecret) {
            return false;
        }

        return TextEncoding.toString(plainSecret);
    },
};

/* Paper Key ==================================================================== */

const PaperKey = {
    generate: (strength: number = 256): string => bip39.generateMnemonic(strength),

    toSeed: (entry: string): Array => bip39.mnemonicToSeed(entry),

    toSeedHex: (entry: string): Array => bip39.mnemonicToSeedHex(entry),

    toEntropy: (entry: string): Array => bip39.mnemonicToEntropy(entry),
};

/* Storage ==================================================================== */

const Storage = {
    encrypt: (entry: string): string => sjcl.encrypt(deviceId, entry, { mode: 'gcm' }),

    decrypt: (plain: string): string => sjcl.decrypt(deviceId, plain, { mode: 'gcm' }),
};

export { SHA256, Secret, PaperKey, Storage };
