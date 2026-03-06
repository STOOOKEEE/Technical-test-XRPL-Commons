export interface IPaymentForm {
  destination: string
  amount: string
}

export interface IPaymentResult {
  txHash: string
  explorerUrl: string
}
