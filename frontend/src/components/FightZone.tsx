import React from 'react'
import '../styles/FightZone.css'
import { useBattleMasterContext } from '../context/BattleMasterContext'
import { fighters } from '../data/fighters';

const FightZone: React.FC = () => {
  const { fight, fightInProgress, challenger, wonAnyBattle } = useBattleMasterContext()

  if (wonAnyBattle) {
    return (
      <div className="fight-zone">
        <div className="victory-message">
          <h1 className="congratulations">Congratulations! You have defeated the Battle Arena!</h1>
          <p className="restart-instructions">To start again, reconnect with a new ghostnet account and reload this page</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="fight-zone">
      <div className="fighter-card">
        <div className="fighter-image-container">
          {challenger ? (
            <img
              src={`${import.meta.env.BASE_URL}/images/fighters/${fighters[Number(challenger.chosen_fighter_id)].name}.jpg`}
              onError={(e) => { e.currentTarget.src = `https://ipfs.io/ipfs/${fighters[Number(challenger.chosen_fighter_id)].ipfsHash}`; e.currentTarget.onerror = null; }}
              alt={`Fighter ${fighters[Number(challenger.chosen_fighter_id)].name}`}
              className="fighter-image"
            /> 
          ) : (
            <div className="fighter-image">Challenger's Fighter</div>
          )}
        </div>
        <div className="fighter-label">
          {challenger ? `Your pathetic ${fighters[Number(challenger.chosen_fighter_id)].name}` : "Your pathetic fighter"}
        </div>
      </div>
      <div className="fight-button-container">
        <div className="vs-text">VS</div>
        <button className="fight-button" onClick={fight} disabled={fightInProgress}>
          {fightInProgress ? 'Fighting...' : 'Fight!'}
        </button>
      </div>
      <div className="fighter-card">
        <div className="fighter-image-container">
          <img
            src={`${import.meta.env.BASE_URL}/images/fighters/dragon.jpg`}
            onError={(e) => { e.currentTarget.src = `https://ipfs.io/ipfs/QmPPW2Rg1GYoBbXbMbsh3Mk6m9BagdiVjcRpoLyxDkkFbc`; e.currentTarget.onerror = null; }}
            alt="Battlemaster's Fighter"
            className="fighter-image"
          />
        </div>
        <div className="fighter-label">My mighty DRAGON!</div>
      </div>
      </div>
    </div>
  )
}

export default FightZone
