import React from 'react'
import { CallResult } from '@completium/archetype-ts-types'
import { challengers_big_map_value } from '../../contract-bindings/battlemaster'

interface BattleMasterContextProps {
    registerChallenger: (fighterId: number) => Promise<CallResult | undefined>
    fetchChallenger: () => Promise<void>
    challenger: challengers_big_map_value | undefined | null,
    fight: () => Promise<CallResult | undefined>,
    fightInProgress: boolean,
    // fetchFightHistory: () => Promise<void>
    registerInProgress: boolean,
    // fightHistoryLoading: boolean,
    showFighterChooser: boolean,
    setShowFighterChooser: (value: boolean) => void,
    loadingChallenger: boolean,
    wonAnyBattle: boolean
}

const BattleMasterContext = React.createContext<BattleMasterContextProps>({
    registerChallenger: function(): Promise<CallResult | undefined> {
        throw new Error("Function not implemented.")
    },
    fetchChallenger: function(): Promise<void> {
        throw new Error("Function not implemented.")
    },
    registerInProgress: false,
    challenger: undefined,
    fight: function(): Promise<CallResult | undefined> {
        throw new Error("Function not implemented.")
    },
    fightInProgress: false,
    showFighterChooser: true,
    setShowFighterChooser: function(): void {
        throw new Error("Function not implemented.")
    },
    loadingChallenger: false,
    wonAnyBattle: false
})

const useBattleMasterContext = () => React.useContext(BattleMasterContext)

export { BattleMasterContext, useBattleMasterContext }
export type { BattleMasterContextProps }
