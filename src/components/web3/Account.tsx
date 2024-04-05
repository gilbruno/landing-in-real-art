import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  
  return (
    <div>
      {address && <div>{`${address}`}</div>}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}