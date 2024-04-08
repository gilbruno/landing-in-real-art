import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import styles from './Account.module.scss'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  
  return (
    <div className={styles.accountContainer}>
      <div>{address && <div>{`${address.slice(0,6)}...${address.slice(-6)}`}</div>}</div>
      <div className={styles.buttonDisconnectAccount}>
          <button onClick={() => disconnect()}>Disconnect</button>
      </div>    
      
    </div>
  )
}