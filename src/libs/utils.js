/* eslint-disable no-cond-assign */
// @flow
import { TextEncoder, TextDecoder } from 'text-encoding';

const Hex = {
    // Convert a hex string to a byte array
    hexToBytes: (hex: string): Array => {
        const bytes = [];
        let c = 0;
        for (bytes, c; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: (bytes: Array): string => {
        const hex = [];
        let i = 0;
        for (hex, i; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xf).toString(16));
        }
        return hex.join('');
    },
};

/* Text Encoding ==================================================================== */
const TextEncoding = {
    //  string to uint8
    toUnit8: (string: string): Array<number> => new TextEncoder('utf-8').encode(string),

    // uint8 to string
    toString: (uint8array: Array<number>): string => new TextDecoder('utf-8').decode(uint8array),
};

/* Base64 ==================================================================== */
// eslint-disable-next-line spellcheck/spell-checker
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
    // uint8 to string
    encode: (uint8array: Array<number>): string => {
        let i;
        const s = [];
        const arr_length = uint8array.length;
        for (i = 0; i < arr_length; i++) {
            s.push(String.fromCharCode(uint8array[i]));
        }
        return Base64.btoa(s.join(''));
    },

    // Base64 to Uint8
    decode: (base64: string): Array<number> => {
        let i;
        const d = Base64.atob(base64);
        const b = new Uint8Array(d.length);
        for (i = 0; i < d.length; i++) {
            b[i] = d.charCodeAt(i);
        }
        return b;
    },

    btoa: (input: string): string => {
        const str = input;
        let output = '';

        for (
            let block = 0, charCode, i = 0, map = chars;
            str.charAt(i | 0) || ((map = '='), i % 1);
            output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
        ) {
            charCode = str.charCodeAt((i += 3 / 4));

            block = (block << 8) | charCode;
        }

        return output;
    },

    atob: (input: string): string => {
        const str = input.replace(/=+$/, '');
        let output = '';

        if (str.length % 4 === 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        for (
            let bc = 0, bs = 0, buffer, i = 0;
            (buffer = str.charAt(i++));
            ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
                ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0
        ) {
            buffer = chars.indexOf(buffer);
        }

        return output;
    },
};

/* Other utils  ==================================================================== */
// Generate random unique numbers in arr
const RandomNumber = (length: number, size: number): Array<number> => {
    if (length < 1 && size > length) {
        console.error("Size can't be bigger than Max Number");
    }

    const arr = [];
    while (arr.length < size) {
        const randomNumber = Math.floor(Math.random() * length) + 1;
        if (arr.indexOf(randomNumber) > -1) {
            continue;
        }
        arr[arr.length] = randomNumber;
    }
    return arr;
};

const Truncate = (fullStr: string, string_length: number): string => {
    if (fullStr.length <= string_length) {
        return fullStr;
    }

    const separator = '...';

    const separator_length = separator.length;
    const charsToShow = string_length - separator_length;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

/* Export ==================================================================== */
export { RandomNumber, TextEncoding, Hex, Base64, Truncate };
