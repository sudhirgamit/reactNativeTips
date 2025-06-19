import {Buffer} from 'buffer';
const base64ToBinary = (str: string) =>
  Buffer.from(str, 'base64').toString('binary');

const binaryToBase64 = (binary: string) =>
  Buffer.from(binary, 'binary').toString('base64');

const base64ToByteArray = (base64: string) => {
  try {
    const binaryString = base64ToBinary(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes; // returns the byte array
  } catch (error: any) {
    console.log('error In base64ToByteArray :', error.message);
    return [];
  }
};

export {base64ToBinary, binaryToBase64, base64ToByteArray};
