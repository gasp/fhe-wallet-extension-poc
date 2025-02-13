import { describe, it, expect } from 'vitest'
import { encryptPrivateKey, decryptPrivateKey } from './aes'

describe('AES encryption and decryption', () => {
  const password = 'test_password'
  const privateKey = 'test_private_key'

  it('should encrypt and decrypt the private key correctly', async () => {
    const { encrypted, iv } = await encryptPrivateKey(password, privateKey)
    const decrypted = await decryptPrivateKey(
      password,
      Array.from(encrypted),
      Array.from(iv)
    )

    expect(decrypted).toBe(privateKey)
  })

  it('should decrypt this ', async () => {
    const { encrypted, iv } = JSON.parse(
      '{"encrypted":[145,162,121,234,22,95,23,99,127,201,211,7,59,20,27,119,118,16,238,59,246,69],"iv":[182,99,24,106,118,137,16,123,204,115,40,64]}'
    )
    const decrypted = await decryptPrivateKey('swordfish', encrypted, iv)

    expect(decrypted).toBe('secret')
  })

  it('should throw an error with incorrect password', async () => {
    const { encrypted, iv } = await encryptPrivateKey(password, privateKey)
    await expect(
      decryptPrivateKey('wrong_password', Array.from(encrypted), Array.from(iv))
    ).rejects.toThrow()
  })

  it('should throw an error with incorrect iv', async () => {
    const { encrypted } = await encryptPrivateKey(password, privateKey)
    const wrongIv = new Uint8Array(12)
    await expect(
      decryptPrivateKey(password, Array.from(encrypted), Array.from(wrongIv))
    ).rejects.toThrow()
  })

  it('should throw an error with incorrect encrypted data', async () => {
    const { iv } = await encryptPrivateKey(password, privateKey)
    const wrongEncrypted = new Uint8Array(16)
    await expect(
      decryptPrivateKey(password, Array.from(wrongEncrypted), Array.from(iv))
    ).rejects.toThrow()
  })
})
