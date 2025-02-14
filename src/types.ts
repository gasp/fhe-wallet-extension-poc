export type Transaction = {
  encrypted: boolean
  to: string
  amount: string
  hash: string
  status: 'Encrypting' | 'Pending' | 'Confirmed' | 'Failed'
}
