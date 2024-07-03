import React, { useState, useEffect } from 'react';
import { useWalletContext } from './WalletContext';
import { useBattleMasterContext } from './BattleMasterContext';
import { LearningTasksContext, Task,  UserInputTask } from './LearningTasksContext';
import { getFighterNameFromId } from '../data/fighters';

export const LearningTasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const { account, getBalance, balance } = useWalletContext();
  const { challenger, wonAnyBattle } = useBattleMasterContext();
  const [recentTimestamp, setRecentTimestamp] = useState<string | null>(null);
  const [cModeEverToggled, setCModeEverToggled] = useState(false);

  useEffect(() => {
    if (challenger && challenger.c_mode.to_number() > 0) {
      setCModeEverToggled(true);
    }
  }, [challenger]);

  // Function to generate the correctInput RegExp
  const generateCaseInsensitiveRegExp = (inputString:string) => {
    // Trim any leading or trailing whitespace from the input string
    const trimmedString = inputString.trim().toLowerCase();
    
    // Create the regular expression with optional whitespace on either side, and case insensitive flag
    const regex = new RegExp(`^\\s*${trimmedString}\\s*$`, 'i');
    
    return regex;
  };
  
  const [ accountMatcher, setAccountMatcher] = useState(account ? generateCaseInsensitiveRegExp(account.address) : /^$/)

  useEffect(() => {
    if (account) {
      getBalance();
      setAccountMatcher(generateCaseInsensitiveRegExp(account.address))
    }
  }, [account, getBalance]);

  const [fighterSet, setFighterSet] = useState(new Set())
  
  useEffect(() => {
    if (challenger) {
      setFighterSet(new Set(challenger?.fightHistory?.map(fight => fight.challenger_fighter_name)))
    }
  }, [challenger]);

  function formatTimestamp(timestamp: string): string {
    // Create a Date object from the timestamp string
    const date = new Date(timestamp);

    // Use Date methods to extract and format date components
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Months are zero-indexed, so we add 1
    const day = ('0' + date.getUTCDate()).slice(-2);
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);
    const seconds = ('0' + date.getUTCSeconds()).slice(-2);

    // Construct the formatted ISO 8601 date string without milliseconds and with 'Z' timezone
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

    return formattedDate;
}

  useEffect(() => {
    if (challenger?.fightHistory?.[0]?.fight_timestamp) {
      const fightStampISO = challenger.fightHistory[0].fight_timestamp.toISOString()
      const formattedTimeStampISO = formatTimestamp(fightStampISO)
      setRecentTimestamp(formattedTimeStampISO);
    }
  }, [challenger]);


  const tasks: Task[] = [
    {
      index: 0,
      title: `Breaking the Battle Arena`,
      introduction: `In this activity we will explore the decentralised and very rigged game: <strong>BATTLE ARENA</strong>. We will use a block explorer to investigate the inner workings of this dApp. Can you beat the game?`,
      subtasks: [
        {
          type: 'checkbox',
          instructionText: null,
          checkboxLabel: `Connect to BATTLE ARENA with a ghostnet wallet`,
          hints: [
            `Click the "Connect" button`, 
            'Try the <a href="https://templewallet.com/download">Temple Wallet Extension</a> (unless you have the Safari browser. In that case, try <a href="https://ghostnet.kukai.app">Kukai</a>).', 
            `Make sure your wallet is connected to the ghostnet, and not the main tezos network!`
          ],
          completed: !!account,
          completionText: `Connected with account: ${account?.address.toString().slice(0, 10)}...`
        },
        {
          type: 'checkbox',
          instructionText: `Add funds to your wallet at the <a href="https://faucet.ghostnet.teztnets.com/">ghostnet faucet</a>.`,
          checkboxLabel: `Fund your wallet`,
          hints: [
            `Follow this link to the <a href="https://faucet.ghostnet.teztnets.com/">ghostnet faucet</a>.`,
            `Paste your wallet address in the "Fund any address" textbox.`,
            `Select 100 Tez as the amount and click "Request 100ꜩ".`
          ],
          completed: balance > 0,
          completionText: `Balance: ${balance.toFixed(2)}ꜩ.`
        },
        {
          type: 'checkbox',
          instructionText: null,
          checkboxLabel: `Choose a fighter`,
          hints: [`Click on a fighter portrait.`, `With a fighter selected, click the "Choose fighter" button and follow the prompts to make an entrypoint call with your wallet`],
          completed: !!challenger,
          completionText: `${(getFighterNameFromId(Number(challenger?.chosen_fighter_id)) || 'Unknown').charAt(0).toUpperCase() + (getFighterNameFromId(Number(challenger?.chosen_fighter_id)) || 'Unknown').slice(1)} selected`
        },
        {
          type: 'checkbox',
          instructionText: null,
          checkboxLabel: `Initiate a battle`,
          hints: [`After choosing a fighter, click the "Enter the Arena" button`,`Once you are in the Arena, click "Fight" and follow the prompts`], 
          completed: (challenger?.fightHistory?.length ?? 0) > 0,
          completionText: `A ${challenger?.fightHistory?.[0] ? challenger?.fightHistory?.[0].challenger_fighter_name : 'Unknown'} fought for you and was ${ (challenger?.fightHistory?.[0])?.battlemaster_victorious ? 'crushed' : 'victorious!'}.`
        },
      ],
    },
    {
      index: 1,
      title: `Finding the contract`,
      introduction: `Let's see what we can learn the BATTLE ARENA contract starting from the dApp UI.`,
      subtasks: [
        {
          type: 'textInput',
          instructionText: `What contract is this dApp making calls to?`,
          hints: [`Click on a button that triggers an entrypoint call.`, `Take a look at the data you are presented with when you are asked to confirm an operation with your wallet.`],
          correctInput: generateCaseInsensitiveRegExp(import.meta.env.VITE_CONTRACT_ADDRESS),
          completionText: `Yep! That's the Battle Arena contract address all right.`,
          textInputLabel: `Contract address:`
        },
        {
          type: 'textInput',
          instructionText: `What is the name of the entrypoint that is called when you first choose or change fighter?`,
          hints: [`From the arena, you can click "Change Fighter" to go back to the fighter selection page`, `Look at the transaction details that appear in the wallet confirmation pop-up after clicking the button. You might have to dig into the raw object that is being sent `, `If you are using the temple wallet, click on the 'raw' tab. Then scroll down and open the 'parameters' section`],
          correctInput: generateCaseInsensitiveRegExp('register_challenger'),
          completionText: `That's it! register_challenger is the entrypoint in question.`,
          textInputLabel: `Entrypoint name:`
        }
      ]
    },
    {
      index: 2,
      title: `Block Explorer Basics`,
      introduction: `Now let's dive deeper into the contract using a block explorer. Let's DELVE, even`,
      subtasks: [
        {
          type: 'textInput',
          instructionText: `Investigate the contract at <a href="https://better-call.dev/">better-call.dev</a>. What is the name of the object that your register_challenger call modified?`,
          hints: [
            `Go to <a href="https://better-call.dev/">better-call.dev</a> and search for the contract address`,
            `Look for the "Operations" tab and find your recent transaction`,
            `Examine the "Storage Diff" section of your transaction`
          ],
          correctInput: generateCaseInsensitiveRegExp('challengers_big_map'),
          completionText: `Correct! The 'challengers' storage object was modified by your register_challenger call.`,
          textInputLabel: `Storage object name:`
        },
        {
          type: 'textInput',
          instructionText: `What key was added to that storage object when you called register_challenger?`,
          hints: [
            `You just need to input the key as plain text.`,
            `Look at the "Storage Diff" section of your transaction in the block explorer`,
            `If you are having trouble copy-pasting from the better-call.dev UI... doesn't that address string used as the big_map key look familiar? Say maybe it is the address of someone you know well? Very well?`
          ],
          correctInput: accountMatcher,
          completionText: `Nice! Calling the entrypoint added an entry to the challengers_big_map with your account address as the key.`,
          textInputLabel: `Key added to storage:`
        }
      ]
    },
    {
      index: 3,
      title: `Block Explorer Basics continued`,
      introduction: "",
      subtasks: [
        {
          type: 'checkbox',
          instructionText: `Fight the battlemaster at least twice, using different fighters each time.`,
          checkboxLabel: `Fought at least twice with different fighters`,
          hints: [
            `Select a different fighter and click the "Fight!" button`,
            `Repeat this process with another fighter`
          ],
          completed: fighterSet.size >= 2,
          completionText: `Great job! You've fought with the following fighters: ${Array.from(fighterSet).join(', ')}.`
        },
        {
          type: 'textInput',
          instructionText: `What is the timestamp of your most recent fight?`,
          hints: [
            `Check your fight history in the UI`,
            `You can also find this information in the block explorer under your recent transactions`,
            `The timestamp should be in the iso format: YYYY-MM-DD HH:MM:SS`
          ],
          correctInput: recentTimestamp 
            ? new RegExp(`^\\s*${recentTimestamp}\\s*$`, 'i')
            : /^$/,
          completionText: `Correct! That's the timestamp of your most recent battle.`,
          textInputLabel: `Timestamp:`
        }
      ]
    },
    {
      index: 4,
      title: `Block explorer interactions`,
      introduction: `Let's interact with the contract directly using the block explorer.`,
      subtasks: [
        {
          type: 'textInput',
          instructionText: `Sign into better-call.dev with your wallet. Then, find an entrypoint on the contract that doesn't appear to be accessible directly from the app. What is its name?`,
          hints: [
            `On better-call.dev, find the 'Interact' tab for the contract to see a list of all the entrypoints`,
            `Look for an entrypoint that you haven't seen in the dApp interface`,
          ],
          correctInput: generateCaseInsensitiveRegExp('toggle_c_mode'),
          completionText: `Correct! This entrypoint is indeed not directly accessible from the app interface.`,
          textInputLabel: `Entrypoint name:`
        },
        {
          type: 'checkbox',
          instructionText: `Now, call the entrypoint you have identified using better-call.dev.`,
          checkboxLabel: `Call the mysterious entrypoint`,
          hints: [
            `Make sure you are connected to better-call.dev with the same account as with the dApp AND are on the ghostnet`,
            `When you call the entrypoint, make sure you select "wallet" as the calling method`,
          ],
          completed: cModeEverToggled,
          completionText: `Great job! You've successfully interacted with the mysterious entrypoint.`
        }
      ]
    },
    {
      index: 5,
      title: `Defeat the Battlemaster`,
      introduction: `Now that you've explored the contract, it's time to put your knowledge to the test and defeat the Battlemaster!`,
      subtasks: [
        {
          type: 'checkbox',
          instructionText: `Defeat the Battlemaster`,
          checkboxLabel: `I have defeated the Battlemaster`,
          hints: [
            `Try exploring the contract further. Is there anything here that gives a hint on how the winner is determined?`,
            `Have a look at the storage on the contract. What is there besides the challengers_big_map?`,
            `Look at the fighters_map in the contract storage. Look at the entries in the map. Anything helpful here?`,
            `Have another look at the entrypoints - can you find a way that you could take advantage of what you have learned about the different champions?`,
            `Notice that when you call the register_challenger entrypoint you must provide a parameter of type integer - what could this be?`,
            `Try calling the register_challenger entrypoint again, but changing the parameter. How does that impact who your fighter is in the dapp?`,
            `The integer parameter for register_challenger is what determines your fighter in the arena.`,
            `The solution: use better-call.dev to directly call register_challenger on the contract with int 7 as the paramter (which corresponds to the fighter_id of the hidden nano-bots fighter). You will see your fighter change in the dApp. Then you can call the fight entrypoint.`
          ],
          completed: wonAnyBattle,
          completionText: `Congratulations! You've defeated the Battlemaster and completed the challenge!`
        }
      ]
    }
  ];

  const generateUserInputObject = (tasks: Task[]): UserInputTask[] => {
    return tasks.map(task => ({
      subtasks: task.subtasks.map(subtask => {
        if (subtask.type === 'textInput') {
          return {
            userInput: '',
            completed: false, // Initially false as userInput is empty
          };
        } else {
          return null;
        }
      }),
    }));
  };
  
  
  

  const [userInputs, setUserInputs] = useState(generateUserInputObject(tasks));



  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
  };


  const currentTask: Task = tasks[currentTaskIndex];
  const isNextDisabled = currentTaskIndex === tasks.length - 1;
  const isPreviousDisabled = currentTaskIndex === 0;

  const updateUserInput = (taskIndex: number, subtaskIndex: number, input: string) => {
    setUserInputs(prevInputs => {
      const newInputs = [...prevInputs];
      const subtask = newInputs[taskIndex].subtasks[subtaskIndex];
      if (subtask) {
        subtask.userInput = input;
        const originalSubtask = tasks[taskIndex].subtasks[subtaskIndex];
        if ('correctInput' in originalSubtask && originalSubtask.type === 'textInput') {
          subtask.completed = originalSubtask.correctInput.test(input);
        }
      }
      return newInputs;
    });
  };

  const value = {
    currentTask,
    isNextDisabled,
    isPreviousDisabled,
    handleNextTask,
    handlePreviousTask,
    updateUserInput,
    userInputs,
    wonAnyBattle,
    cModeEverToggled,
  };

  return (
    <LearningTasksContext.Provider value={value}>
      {children}
    </LearningTasksContext.Provider>
  );
};
