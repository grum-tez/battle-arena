import React from 'react';
import Dapp from './Dapp';
import LearningDash from './LearningDash';
import '../styles/Layout.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <LearningDash />
      <div className="main-content">
        <Dapp />
      </div>
    </div>
  );
}

export default App;
