import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { run_listener } from "@completium/event-listener"
import { useWalletContext } from './WalletContext'
import { Battlemaster, challengers_big_map_value } from '../../contract-bindings/battlemaster'
import { BattleMasterContext } from './BattleMasterContext'
import { Nat, Address } from '@completium/archetype-ts-types'

const BattleMasterProvider = ({ children }: { children: React.ReactNode }) => {
    
    const { Tezos, account } = useWalletContext()
    const [battleMasterContract, setBattleMasterContract] = useState<Battlemaster>()
    const [challenger, setChallenger] = useState<challengers_big_map_value | undefined | null>()
    const [registerInProgress, setRegisterInProgress] = useState<boolean>(false)
    const [fightInProgress, setFightInProgress] = useState<boolean>(false)
    const [showFighterChooser, setShowFighterChooser] = useState<boolean>(true)
    const [loadingChallenger, setLoadingChallenger] = useState<boolean>(false)
    const [wonAnyBattle, setWonAnyBattle] = useState(false)

    useEffect(() => {
      if (challenger?.fightHistory) {
        const hasWon = challenger.fightHistory.some(fight => !fight.battlemaster_victorious);
        setWonAnyBattle(hasWon);
      } else {
        setWonAnyBattle(false);
      }
    }, [challenger]);
    
    const fetchChallenger = useCallback(
      async () => {
        if (!battleMasterContract || !account || !account.address) {
          return
        } 
        setLoadingChallenger(true)
        try {
          const isRegistered = await battleMasterContract.has_challengers_big_map_value(new Address(account.address));
          if (!isRegistered) {
            setChallenger(null);
            
          } else {
            const fetchedChallenger = await battleMasterContract.get_challengers_big_map_value(new Address(account.address));
            setChallenger(fetchedChallenger);
            if (fetchedChallenger) {
              console.log("Fetched Challenger: ", fetchedChallenger);
            }
          }
        } catch (e) {
          console.error(e)
        }
        finally {
          setFightInProgress(false);
          setLoadingChallenger(false);
        }
      },
      [battleMasterContract, account]
    )

    useEffect(() => {
      if (!battleMasterContract || !account || !account.address) { return }
      console.log("[Event Listener] Initializing event listener setup at:", new Date().toISOString())
      const startListener = async () => {

        battleMasterContract.register_new_challenger_registered(async (t) => {
          console.log("Event detected. New challenger registered: ", t)

          console.log(t.new_challenger_address.toString())
          console.log(t.new_challenger_fighter_id.toString())
          console.log(t.new_challenger_fight_history.toString())
          console.log(t.new_challenger_fight_count.toString())
          console.log("Account: ", account)
          console.log("Wallet Address: ", account?.address)
          console.log(account && account.address === t.new_challenger_address.toString())

          if (account && account.address === t.new_challenger_address.toString()) {
            const updatedChallenger = new challengers_big_map_value(
                t.new_challenger_fighter_id, 
                t.new_challenger_fight_history, 
                t.new_challenger_fight_count, 
                t.new_challenger_c_mode
            );
            console.log("updating challenger from event")
            setChallenger(updatedChallenger)
          }
        });

        battleMasterContract.register_new_fight_recorded(async (t) => {
          console.log("Fight event detected.", t);

          if (!account || account.address !== t.challenger_address.toString()) {
            console.log("Account does not match the challenger address. Doing nothing.");
            return;
          }

          console.log("Account matches the challenger address.");

          const incoming_fight_record = t.new_fight_record


          setChallenger(prevChallenger => {
            console.log("Previous Challenger: ", prevChallenger);
            if (prevChallenger) {
              const currentFightHistory = prevChallenger.fightHistory;
              console.log("Current Fight History: ", currentFightHistory);
              if (currentFightHistory.length > 0) {
                const firstFightRecord = currentFightHistory[0];
                console.log("First Fight Record: ", firstFightRecord);
                console.log("First Fight Record Timestamp: ", firstFightRecord.fight_timestamp.toISOString());
                console.log("Incoming Fight Record Timestamp: ", incoming_fight_record.fight_timestamp.toISOString());
                if (firstFightRecord.fight_timestamp.getTime() === incoming_fight_record.fight_timestamp.getTime()) {
                  console.log("Timestamps are the same. Doing nothing.");
                  return prevChallenger; // Do nothing if timestamps are the same
                }
                console.log("Timestamps are not the same")
              }
              if (currentFightHistory.length === 0 || incoming_fight_record.fight_timestamp > currentFightHistory[0].fight_timestamp) {
                console.log("Incoming fight timestamp is more recent. Prepending new fight record.");
                const updatedFightHistory = [incoming_fight_record, ...currentFightHistory];
                console.log("Updated Fight History: ", updatedFightHistory);
                return new challengers_big_map_value(
                  prevChallenger.chosen_fighter_id,
                  updatedFightHistory,
                  prevChallenger.fightCount.plus(new Nat(1)),
                  prevChallenger.c_mode
                );
              }
              console.log("Incoming timestamp was not more recent")
            }
            console.log("No previous challenger or no update needed.");
            return prevChallenger;
          });
        });

        battleMasterContract.register_activity_reset(async (t) => {
          console.log("Activity reset event detected.", t);
          alert(`Activity reset for account - ${t.challenger_address.toString()}`);
        });

        battleMasterContract.register_c_mode_updated(async (t) => {
          console.log("C-Mode update event detected.", t);

          if (!account || account.address !== t.challenger_elf.toString()) {
            console.log("Account does not match the challenger address. Doing nothing.");
            return;
          }

          console.log("Account matches the challenger address.");

          setChallenger(prevChallenger => {
            if (prevChallenger) {
              console.log("Updating C-Mode for challenger.");
              return new challengers_big_map_value(
                prevChallenger.chosen_fighter_id,
                prevChallenger.fightHistory,
                prevChallenger.fightCount,
                t.c_mode_on
              );
            }
            console.log("No previous challenger. Cannot update C-Mode.");
            return prevChallenger;
          });
        });

        console.log("[Event Listener] Starting run_listener at:", new Date().toISOString());
        await run_listener({
          endpoint: import.meta.env.VITE_TEZOS_RPC,
          verbose: false,
          horizon: 0
        })
      }
      startListener()
    }, [battleMasterContract, account, fetchChallenger])



    useEffect(() => {
      if (!Tezos) {
        return
      }
      const initializeContract = async () => {
        console.log("Initialising BattleMaster contract")
        const BMcontract = new Battlemaster(import.meta.env.VITE_CONTRACT_ADDRESS)
        setBattleMasterContract(BMcontract)
        console.log("Initialised contract: ", BMcontract)
    }
    initializeContract()
    }, [Tezos])

    useEffect(() => {
      if (account && Tezos) {
        fetchChallenger()
      }
    }, [account, Tezos, fetchChallenger])

    const registerChallenger = useCallback(
      async (fighterId: number) => {
        console.log("registering challenger with fighter Id: ", fighterId)
        if (!battleMasterContract || !account || !account.address) {
          return
        }
        
        setRegisterInProgress(true)
        try {
          const register_challenger_call_result = await battleMasterContract.register_challenger(new Nat(fighterId), {})
          setRegisterInProgress(false)
          return register_challenger_call_result
        } catch (error) {
          console.error(error)
          setRegisterInProgress(false)
        }
        
      },
      [battleMasterContract, account]
    )

    const fight = useCallback(
      async () => {
        if (!battleMasterContract || !account || !account.address) {
          return
        }
        setFightInProgress(true)
        try {
          const result = await battleMasterContract.fight({});
          fetchChallenger();
          return result;
        } catch (error) {
          console.error(error)
          setFightInProgress(false)
        }
      },
      [battleMasterContract, account, fetchChallenger]
    )

  const value = useMemo(
    () => ({
      registerChallenger,
      fetchChallenger,
      registerInProgress,
      challenger,
      fight,
      fightInProgress,
      showFighterChooser,
      setShowFighterChooser,
      loadingChallenger,
      wonAnyBattle
    }),
    [
      registerChallenger,
      fetchChallenger,
      registerInProgress,
      challenger,
      fight,
      fightInProgress,
      showFighterChooser,
      loadingChallenger,
      wonAnyBattle
    ]
  )
    return (
        <BattleMasterContext.Provider value={value}>
            {children}
        </BattleMasterContext.Provider>
    )
}

export { BattleMasterProvider }

