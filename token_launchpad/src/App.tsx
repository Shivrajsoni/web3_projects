import './App.css';
import TokenLaunchpad from "./components/TokenLaunchpad";
// wallet adapter imports
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {

  return (
    <div>
      <ConnectionProvider endpoint = {"https://solana-devnet.g.alchemy.com/v2/T0a2jUFAXvqn3dc4Q22m92mMiclu33C4"}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div style = {{
              display:"flex",
              justifyContent:"center",
              padding:20,
              gap:10
            }}>
              <WalletMultiButton/>
              <WalletDisconnectButton/>
            </div>
            <TokenLaunchpad></TokenLaunchpad>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default App
