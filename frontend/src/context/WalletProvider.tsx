import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { AccountInfo, NetworkType, ColorMode, BeaconEvent } from "@airgap/beacon-types"
import { TezosToolkit } from "@taquito/taquito"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { set_binder_tezos_toolkit } from "@completium/dapp-ts"
import { WalletContext, WalletContextProps } from "./WalletContext"


const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [Tezos, setTezos] = useState<TezosToolkit>()
  const [wallet, setWallet] = useState<BeaconWallet | undefined>()
  const [account, setAccount] = useState<AccountInfo>()
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    console.log("account", account)
  }, [account])

  useEffect(() => {
    if (!Tezos) {
      const Tezos = new TezosToolkit(
        import.meta.env.VITE_TEZOS_RPC ?? "localhost:20000"
      )
      const beacon = new BeaconWallet({
        name: "BattleArena",
        preferredNetwork: (import.meta.env.VITE_TEZOS_NETWORK_NAME ||
          "sandbox") as NetworkType,
        colorMode: ColorMode.DARK,
      })
      Tezos.setWalletProvider(beacon)
      set_binder_tezos_toolkit(Tezos)

      // Clear any existing account on init
      await beacon.clearActiveAccount()
      
      // Subscribe to pairing success
      beacon.client.subscribeToEvent(BeaconEvent.PAIR_SUCCESS, (data) => {
        console.log(`${BeaconEvent.PAIR_SUCCESS} triggered:`, data)
      })

      // Subscribe to active account changes
      beacon.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, (account) => {
        console.log("Active account changed:", account)
        setAccount(account)
      })

      const activeAccount = await beacon.client.getActiveAccount()
      setAccount(activeAccount)
      setTezos(Tezos)
      setWallet(beacon)
    }
  }, [Tezos])

  const connect = useCallback(async () => {
    try {
      await wallet?.requestPermissions({
        network: {
          type: (import.meta.env.VITE_TEZOS_NETWORK_NAME ?? "ghostnet") as NetworkType,
          rpcUrl: import.meta.env.VITE_TEZOS_RPC,
        },
      })
      const active = await wallet?.client.getActiveAccount()
      console.log(active)
      setAccount(active)
    } catch (e) {
      console.error(e)
    }
  }, [wallet])

  const disconnect = useCallback(async () => {
    if (wallet) {
      await wallet.client.removeAllAccounts()
      await wallet.disconnect()
      setAccount(undefined)
      setBalance(0)
    }
  }, [wallet])

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      wallet?.client.removeAllListeners()
    }
  }, [wallet])

  const getBalance = useCallback(async () => {
    if (!Tezos || !account) {
      return
    }
    const balance = await Tezos.tz.getBalance(account.address)
    setBalance(balance.dividedBy(1_000_000).toNumber())
  }, [Tezos, account])

  useEffect(() => {
    getBalance()
  }, [getBalance])

  const value: WalletContextProps = useMemo(
    () => ({
      connect,
      disconnect,
      getBalance,
      account,
      wallet,
      Tezos,
      balance,
    }),
    [connect, disconnect, getBalance, account, wallet, Tezos, balance]
  )

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  )
}



export { WalletProvider }
