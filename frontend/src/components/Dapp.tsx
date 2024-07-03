import '../styles/dapp.css';
import { useWalletContext } from '../context/WalletContext';
import FighterChooser from './FighterChooser';
import { useBattleMasterContext } from '../context/BattleMasterContext';
import ChallengerDashboard from './ChallengerDashboard';
import BattleArenaTitle from './BattleArenaTitle';
import { useEffect } from 'react';

function Dapp() {
  const { connect, disconnect, account } = useWalletContext();
  const { challenger, showFighterChooser } = useBattleMasterContext();

  useEffect(() => {
    if (challenger && challenger.c_mode.to_number() % 2 !== 0) {
      document.body.classList.add('christmas-theme');
      const audio = new Audio(`${import.meta.env.BASE_URL}/images/bells.mp3`);
      audio.loop = true;
      audio.play();
      return () => {
        document.body.classList.remove('christmas-theme');
        audio.pause();
        audio.currentTime = 0;
      };
    } else {
      document.body.classList.remove('christmas-theme');
    }
  }, [challenger]);

  return (
    <>
      {account && showFighterChooser && <><BattleArenaTitle/> <FighterChooser /></>}
      {challenger && !showFighterChooser && <ChallengerDashboard />}
      <hr></hr>
      <div>
        {account ? (
          <>
            <div>
              Connected to the Tezos Blockchain with account {account.address}
            </div>
            <div>
              <button className="btn-disconnect" onClick={disconnect}>
                Disconnect
              </button>
            </div>


          </>
        ) : (
          <>
            <button className="btn" onClick={connect}>
              Connect
            </button>
            <div>
              No wallet connected
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dapp;
