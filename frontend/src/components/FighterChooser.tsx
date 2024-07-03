import React, { useEffect, useState } from 'react'
import { useBattleMasterContext } from '../context/BattleMasterContext'
import FighterOption from './FighterOption'
import '../styles/FighterChooser.css'
import { fighters, Fighter, getIdFromName, getFighterNameFromId } from '../data/fighters';

const FighterChooser: React.FC = () => {
  const { registerChallenger, registerInProgress, challenger, setShowFighterChooser, loadingChallenger } = useBattleMasterContext();

  const [fighter_selection, setFighterSelection] = useState<Fighter[]>([]);
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false)
  const [registeredFighter, setRegisteredFighter] = useState<Fighter | null>(null);


  useEffect(() => {
    if (challenger && challenger.chosen_fighter_id !== undefined) {
      setAlreadyRegistered(true);
      const fighterName = getFighterNameFromId(challenger.chosen_fighter_id.to_number());
      if (fighterName) {
        setRegisteredFighter(fighters[challenger.chosen_fighter_id.to_number()]);
      }
    } else {
      setAlreadyRegistered(false);
      setRegisteredFighter(null);
    }
  }, [challenger]);

  useEffect(() => {
    const visibleFighters = Object.values(fighters).filter(fighter => !fighter.hidden);
    
    if (registeredFighter) {
      const availableFighters = visibleFighters.filter(fighter => fighter.name !== registeredFighter.name);
      const shuffled = availableFighters.sort(() => 0.5 - Math.random());
      const selection = [
        shuffled[0],
        registeredFighter,
        shuffled[1]
      ];
      setFighterSelection(selection);
      setSelectedFighter(registeredFighter);
    } else {
      const shuffled = visibleFighters.sort(() => 0.5 - Math.random());
      setFighterSelection(shuffled.slice(0, 3));
    }
  }, [registeredFighter]);

  const handleFighterSelect = (fighter: Fighter) => {
    setSelectedFighter(fighter);
  };

  const handleMeetYourDoom = () => {
    if (selectedFighter) {
      const fighterId = getIdFromName(selectedFighter.name);
      if (fighterId !== undefined) {
        registerChallenger(Number(fighterId));
      }
    }
  };

  const getButtonText = () => {
    if (!selectedFighter || !alreadyRegistered) {
      return "Choose fighter";
    } else if (selectedFighter.name === registeredFighter?.name) {
      return `Keep ${selectedFighter.name}`;
    } else {
      return `Swap to ${selectedFighter.name}`;
    }
  };

  const isButtonDisabled = () => {
    return !selectedFighter || registerInProgress || (selectedFighter.name === registeredFighter?.name);
  };

  return (
    <div className="card">
      <h3 style={{textAlign: 'center'}}>
        {alreadyRegistered ? "Current Fighter" : "Select your Fighter"}
      </h3>
      <div className="fighter-options-row">
        {loadingChallenger ? (
          <p>Looking for challenger details...</p>
        ) : (
          fighter_selection.map((fighter, index) => (
            <FighterOption
              key={index}
              name={fighter.name}
              strength={fighter.strength}
              ipfsHash={fighter.ipfsHash}
              isSelected={selectedFighter?.name === fighter.name}
              onClick={() => handleFighterSelect(fighter)}
              isRegistered={fighter.name === registeredFighter?.name}
            />
          ))
        )}
      </div>
      <div className="arena-buttons">
        <button
          className="btn"
          onClick={handleMeetYourDoom}
          disabled={isButtonDisabled()}
        >
          {getButtonText()}
        </button>
      </div>
      {alreadyRegistered && (
        <div className="arena-buttons">
          <button
            className="btn return-btn"
            onClick={() => setShowFighterChooser(false)}
          >
            Enter the Arena
          </button>
        </div>
      )}
      {registerInProgress && <p>Registering...</p>}
    </div>
  )
}

export default FighterChooser
