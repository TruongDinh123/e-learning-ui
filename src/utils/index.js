import CryptoJS from 'crypto-js';


const secretKey='BIryQ4iRqJo1NqwJzJbMvTShcU6Iz4/b';

export const decrypt = async (text) => {
  const parts = text.split(':');
  const iv = new Uint8Array(parts[0].match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const encryptedData = new Uint8Array(parts[1].match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

  const keyBuffer = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secretKey.substr(0, 32)),  // Đảm bảo khóa 32 byte
    { name: 'AES-CBC' },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv: iv
    },
    keyBuffer,
    encryptedData
  );

  return new TextDecoder().decode(decrypted);
}
