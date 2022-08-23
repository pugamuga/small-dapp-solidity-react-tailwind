import "react-toastify/dist/react-toastify.css";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { construct } from "eth/core";

function App() {
  const contractAddress = "0xFb8B1A0341b934A4CF2895Fc8A8AdEf3940532d9";

  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [allHookah, setAllHookah] = useState([]);

  const defaultToast = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        toast.success("Wallet is connected!", defaultToast);
      } else {
        toast.warn("Make sure you have MetaMask Connected", defaultToast);
      }
    } catch (error) {
      toast.error(`${error.message}`, defaultToast);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast.warn("Make sure you have MetaMask Connected", defaultToast);
        return;
      }
      const account = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(account[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyHookah = async() =>{
    try {
      const {ethereum} = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const hookahPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )       
        
        let count = await hookahPortalContract.getTotalHookah()
        console.log("Retrieved total coffee count...", count.toNumber())

        const hookahTxn = await hookahPortalContract.buyHookah(
          message ? message : "Enjoy Your Hookah",
          name ? name : "Anonymous",
          ethers.utils.parseEther("0.001"),
          {
            gasLimit: 300000,
          }
        )
        console.log("Mining...", hookahTxn.hash)

        toast.info("Sending Fund for coffee...", defaultToast)

        await coffeeTxn.wait()

        console.log("Mined -- ", hookahTxn.hash);

        count = await hookahPortalContract.getTotalHookah()

        console.log("Retrieved total hookah count...", count.toNumber());

        setMessage("");
        setName("");

        toast.success("Coffee Purchased!",defaultToast)

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      toast.error(`${error.message}`,defaultToast)
    }
  }

  const getAllHookah = async() =>{
    try {
      const {ethereum} = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const hookahPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )  
        const hookahs = await hookahPortalContract.getAllHookah()   

        const hookahCleaned = hookahs.map((hookah)=>{
          return {
            address: hookah.giver,
            timestamp: new Date(coffee.timestamp * 1000),
            message: hookah.message,
            name: hookah.name,
          };
        })
        setAllCoffee(coffeeCleaned);
      } else{
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() =>{
    let hookahPortalContract
    getAllHookah(),
    checkIfWalletConnected()
  })

  return (
    <div>
      <div></div>
    </div>
  );
}

export default App;
