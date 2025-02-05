import './App.css'
import {ConnectionProvider , WalletProvider } from "@solana/wallet-adapter-react";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {useMemo} from "react";
import {WalletMultiButton,WalletDisconnectButton,WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import  {TokenLaunchPad}  from "./components/createToken.tsx";

function App() {
  const[tokenMint,setTokenMint] = useState(false);

  //const network = WalletAdapterNetwork.Mainnet;

  //const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  return (
      <ConnectionProvider endpoint = {"https://solana-mainnet.g.alchemy.com/v2/T0a2jUFAXvqn3dc4Q22m92mMiclu33C4"}>
      <WalletProvider wallets = {[]}>
        <WalletModalProvider>
          <WalletMultiButton/>
          <WalletDisconnectButton/>
          <TokenLaunchPad onTokenCreate = {(tokenMint)=>setTokenMint(tokenMint)}/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
