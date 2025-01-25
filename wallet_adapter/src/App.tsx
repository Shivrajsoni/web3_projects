//1. Request Airdrop
//2. Show SOL balances (GET data from the blockchain)
//3. Send a transaction (Send a transaction to the blockchain)
//4. Sign a message (Verify the ownership of the wallet)
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletConnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
//import Airdrop from './Airdrop';
//import SendMessageTransaction from './SendMessageTransaction';
//import ShowBalance from './ShowBalance';
import SendingSolana from './SendingSolana';



const App = () => {
  return (
    <ConnectionProvider endpoint={'https://solana-devnet.g.alchemy.com/v2/T0a2jUFAXvqn3dc4Q22m92mMiclu33C4'} >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton></WalletMultiButton>
            <WalletConnectButton></WalletConnectButton>
            <WalletDisconnectButton></WalletDisconnectButton>
        </WalletModalProvider>
        <SendingSolana></SendingSolana>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App

