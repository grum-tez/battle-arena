import React from 'react';

interface FighterOptionProps {
  name: string;
  strength: number;
  ipfsHash: string;
  isSelected: boolean;
  isRegistered: boolean;
  onClick: () => void;
}

const FighterOption: React.FC<FighterOptionProps> = ({ name, strength, isSelected, isRegistered, onClick }) => {
  return (
    <div className={`fighter-option ${isSelected ? 'selected' : ''} ${isRegistered ? 'registered' : ''}`} onClick={onClick}>
      <h4>{name}</h4>
      <div className="fighter-image-container">
        
        {/* Commented out IPFS image source for future use */}
        {/* <img src={`https://ipfs.io/ipfs/${ipfsHash}`} alt={name} /> */}
        <img src={`${import.meta.env.BASE_URL}/images/fighters/${name}.jpg`} alt={name} />
      </div>
      <div className="fighter-info">
        
        <p>Strength: {strength}</p>
      </div>
    </div>
  );
};

export default FighterOption;
