import React from 'react'
import { useBattleMasterContext } from '../context/BattleMasterContext'
import FightResultsViewer from './FightResultsViewer'
import FightZone from './FightZone'
import BattleArenaTitle from './BattleArenaTitle'
import '../styles/ChallengerDashboard.css'

const ChallengerDashboard: React.FC = () => {
  const { challenger, setShowFighterChooser, fightInProgress, wonAnyBattle } = useBattleMasterContext()

  if (!challenger) {
    return <div>You shouldn't be here! You aren't even registered as a challenger!</div>
  }

  const showFightResults = challenger.fightHistory.length > 0 || fightInProgress

  return (
    <div className="challenger-dashboard">
      {!showFightResults && <BattleArenaTitle />}
      {showFightResults && <FightResultsViewer />}
      <FightZone />
      {!wonAnyBattle && (
        <div className="change-fighter-button-container">
          <button onClick={() => setShowFighterChooser(true)}>Change Fighter</button>
        </div>
      )}
    </div>
  )
}

export default ChallengerDashboard
