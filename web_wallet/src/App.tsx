import { useState } from 'react'
import './App.css'
import { generateMnemonic } from 'bip39'
import { SolanaWallet } from './solanawallet'
function App() {
  const [mnemonic, setMnemonic] = useState("")

  return (
    <>
      <div>
        <button onClick={async function () {
          const mn = generateMnemonic();
          setMnemonic(mn);
          console.log(mnemonic);
        }}>create seed </button>
        <input type="text" value={mnemonic} />
      </div>
      <div style={{ background: "yellow" }}>
        <SolanaWallet mnemonic={mnemonic} />
      </div>
    </>
  )
}

export default App
