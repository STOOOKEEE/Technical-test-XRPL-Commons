export interface IPaymentResult {
  txHash: string
  explorerUrl: string
}

export interface IXummSdk {
  authorize: () => Promise<void>
  logout: () => void
  user: {
    account: Promise<string | undefined>
  }
  payload: {
    create: (payload: Record<string, unknown>) => Promise<IXummCreated>
    get: (uuid: string) => Promise<IXummPayload>
    createAndSubscribe: (
      payload: Record<string, unknown>,
      callback: (event: IXummEvent) => IXummEvent | undefined
    ) => Promise<{ created: IXummCreated; resolved: Promise<unknown> }>
  }
}

export interface IXummEvent {
  data: Record<string, unknown>
}

export interface IXummCreated {
  uuid: string
  next: { always: string }
  refs: { qr_png: string }
}

export interface IXummPayload {
  meta: { resolved: boolean; signed: boolean }
  response: { txid: string; dispatched_result: string }
}
