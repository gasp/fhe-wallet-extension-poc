const AES_SALT = import.meta.env.VITE_AES_SALT ?? 'wallet_salt'

async function getKeyFromPassword(password: string) {
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(AES_SALT),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptPrivateKey(
  password: string,
  privateKey: string
): Promise<{ encrypted: number[]; iv: number[] }> {
  const key = await getKeyFromPassword(password)
  const enc = new TextEncoder()
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(privateKey)
  )
  return {
    encrypted: Array.from(new Uint8Array(encrypted)),
    iv: Array.from(iv),
  }
}

export async function decryptPrivateKey(
  password: string,
  encrypted: number[],
  iv: number[]
): Promise<string> {
  const key = await getKeyFromPassword(password)
  const dec = new TextDecoder()
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(Array.from(iv)) },
    key,
    new Uint8Array(encrypted)
  )
  return dec.decode(decrypted)
}
