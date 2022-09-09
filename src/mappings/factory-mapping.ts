import { SportsClubDAO as SportsClubDAOTemplate } from '../../generated/templates'
import { DAOdeployed as DaoDeployedEvent } from '../../generated/SportsClubDAOFactory/SportsClubDAOFactory'
import { DAO, Token, Tribute } from '../../generated/schema'
import { Bytes } from '@graphprotocol/graph-ts'
import { SportsClubDAO } from '../../generated/templates/SportsClubDAO/SportsClubDAO'
import { tokenTotalSupply } from '../helpers/token-helpers'

export function handleDAOdeployed(event: DaoDeployedEvent): void {
  SportsClubDAOTemplate.create(event.params.sportsclubDAO)
  const daoId = event.params.sportsclubDAO.toHexString()
  const dao = new DAO(daoId)

  //
  const contract = SportsClubDAO.bind(event.params.sportsclubDAO)

  // token
  const tokenId = daoId + '-token'
  const token = new Token(tokenId)

  token.dao = daoId
  token.name = event.params.name
  token.symbol = event.params.symbol
  token.totalSupply = tokenTotalSupply(event.params.sportsclubDAO)
  token.paused = event.params.paused
  token.save()

  dao.founder = event.transaction.from
  dao.birth = event.block.timestamp
  dao.docs = event.params.docs
  dao.votingPeriod = event.params.govSettings[0]
  dao.gracePeriod = event.params.govSettings[1]
  dao.quorum = event.params.govSettings[2]
  dao.supermajority = event.params.govSettings[3]
  dao.address = event.params.sportsclubDAO
  dao.extensions = event.params.extensions.map<Bytes>((ext) => ext as Bytes)

  dao.save()

  const tributeId = daoId + '-tribute'
  const tribute = new Tribute(tributeId)
  tribute.dao = daoId
  tribute.active = true
  tribute.save()
}
