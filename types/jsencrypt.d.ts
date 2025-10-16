// Type declarations for jsencrypt
// Since @types/jsencrypt doesn't exist, we declare the types manually

declare module 'jsencrypt' {
  export class JSEncrypt {
    constructor();
    setPublicKey(publicKey: string): void;
    setPrivateKey(privateKey: string): void;
    encrypt(message: string): string | false;
    decrypt(message: string): string | false;
  }
}
