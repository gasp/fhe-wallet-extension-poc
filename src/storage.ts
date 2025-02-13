// when moving to a chrome extension, this will be replaced with chrome.storage.local

const ENCRYPTER_WALLET_KEY = 'encryptedWalletKey'

type EncryptedWalletKeyStorage = {
  encrypted: number[]
  iv: number[]
}

export async function hasEncryptedWalletKey(): Promise<boolean> {
  return new Promise((resolve) => {
    resolve(!!localStorage.getItem(ENCRYPTER_WALLET_KEY))
  })
}

export async function getEncryptedWalletKey(): Promise<EncryptedWalletKeyStorage> {
  return new Promise((resolve, reject) => {
    try {
      const value = localStorage.getItem(ENCRYPTER_WALLET_KEY)
      if (value) {
        resolve(JSON.parse(value) as unknown as EncryptedWalletKeyStorage)
      } else {
        reject(null)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export async function setEncryptedWalletKey(
  value: EncryptedWalletKeyStorage
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(ENCRYPTER_WALLET_KEY, JSON.stringify(value))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
