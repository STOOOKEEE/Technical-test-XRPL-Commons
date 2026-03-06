export interface IClock {
  name: string
  imageUrl: string
}

export interface INftMintResult {
  txHash: string
  explorerUrl: string
}

export interface IPaymentResult {
  txHash: string
  explorerUrl: string
}

export interface IImageEditSettings {
  brightness: number
  colorOverlay: string
  colorOpacity: number
}

export interface IPinataUploadResponse {
  ipfsHash: string
  ipfsUrl: string
}
