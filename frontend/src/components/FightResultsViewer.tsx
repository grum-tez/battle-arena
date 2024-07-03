import React from 'react'
import { useBattleMasterContext } from '../context/BattleMasterContext'
import '../styles/FightResultsViewer.css'

const FightResultsViewer: React.FC = () => {
  const { challenger, fightInProgress } = useBattleMasterContext()
  const [timeSinceLastFight, setTimeSinceLastFight] = React.useState<string>('')

  React.useEffect(() => {
    if (challenger && challenger.fightHistory.length > 0) {
      const latestFight = challenger.fightHistory[0]
      const updateTimer = () => {
        const now = new Date()
        const fightTime = new Date(latestFight.fight_timestamp)
        const diff = Math.floor((now.getTime() - fightTime.getTime()) / 1000)
        const hours = Math.floor(diff / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        const seconds = diff % 60
        setTimeSinceLastFight(`${hours}h ${minutes}m ${seconds}s`)
      }
      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [challenger])

  if (fightInProgress) {
    return (
      <div className="fight-results-viewer">
        <div className="fight-in-progress">
          <img src="https://c.tenor.com/1ig8bfldYpwAAAAC/tenor.gif" alt="Fight in Progress" />
        </div>
      </div>
    )
  }

  const latestFight = challenger!.fightHistory[0]

  return (
    <div className="fight-results-viewer">
      <h3>In our last battle...</h3>
      <h1>
        {latestFight.battlemaster_victorious ? 'YOU LOST' : 'YOU WON'}
      </h1>
      <p className="fighter-result">
        {latestFight.battlemaster_victorious
          ? `Your ${latestFight.challenger_fighter_name} was crushed.`
          : "My mighty dragon was disassembled!"}
      </p>
      <p className="time-since-fight">
        Time since last fight: {timeSinceLastFight}
      </p>
      <p className="fight-count">
        Total Fights: {challenger!.fightCount.toString()}
      </p>
    </div>
  )
}

export default FightResultsViewer
