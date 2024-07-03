export interface Fighter {
  name: string;
  strength: number;
  hidden: boolean;
  ipfsHash: string;
}

export const fighters: Record<number, Fighter> = {
  1: { name: "gnat", strength: 1, hidden: false, ipfsHash: "QmWAKjX1LUnb3v2jQJ3Zd9Gu32tFAewwtjZuABfczs6Mj2" },
  2: { name: "mouse", strength: 4, hidden: false, ipfsHash: "QmbpMjbgsFMaLVmtgJf1AdXRXwppJmuG5NGU44Bp9jqsKd" },
  3: { name: "termite", strength: 2, hidden: false, ipfsHash: "QmRdCMxLtUCRNtiwpLsePFZ6QAAiZPtNxDUMUsvZuxoXeC" },
  4: { name: "skunk", strength: 3, hidden: false, ipfsHash: "QmNt7Xet8oLebiPeRTZCp4qF3CjhWG4itgpw9ZJmpywGz3" },
  5: { name: "sloth", strength: 10, hidden: false, ipfsHash: "QmSXByNYCu3VoF2Q6m9Gy8xugp7Va4XsuUvSMaMSjUD1ou" },
  6: { name: "dragon", strength: 1000, hidden: true, ipfsHash: "QmPPW2Rg1GYoBbXbMbsh3Mk6m9BagdiVjcRpoLyxDkkFbc" },
  7: { name: "nano-bots", strength: 100000, hidden: true, ipfsHash: "QmNutTRBNYoqCCmXCD1xkvQqNhY5DZBupcqUJhxSV3uHK1" }
};

/**
 * Get the name of a fighter given their ID.
 * @param id - The ID of the fighter.
 * @returns The name of the fighter.
 */
export function getFighterNameFromId(id: number): string | undefined {
  const fighter = fighters[id];
  return fighter ? fighter.name : undefined;
}
/**
 * Get the ID of a fighter given their name.
 * @param name - The name of the fighter.
 * @returns The ID of the fighter.
 */
export function getIdFromName(name: string): number | undefined {
  for (const id in fighters) {
    if (fighters[id].name === name) {
      return Number(id);
    }
  }
  return undefined;
}
