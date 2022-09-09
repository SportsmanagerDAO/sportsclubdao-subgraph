import { Address, Bytes } from '@graphprotocol/graph-ts'
import { SportsClubDAOredemption } from '../../generated/SportsClubDAOredemption/SportsClubDAOredemption'

export function getRedeemables(dao: Address): Bytes[] {
  const contract = SportsClubDAOredemption.bind(dao)

  const redeemables = contract.try_getRedeemables(dao).value
  const redeemablesBytes = redeemables.map<Bytes>((redeemable) => redeemable as Bytes)

  return redeemablesBytes
}
