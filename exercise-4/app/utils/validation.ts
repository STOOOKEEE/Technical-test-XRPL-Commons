import { XRP_ADDRESS_REGEX } from '~/utils/constants'

export function isValidXrplAddress(address: string): boolean {
  return XRP_ADDRESS_REGEX.test(address)
}

export function isValidXrpAmount(amount: string): boolean {
  const num = Number(amount)
  return !Number.isNaN(num) && num > 0 && Number.isFinite(num)
}
