export type Transaction = {
  to: string
  amount: bigint
  hash: string
  status: 'Pending' | 'Confirmed' | 'Failed'
}
