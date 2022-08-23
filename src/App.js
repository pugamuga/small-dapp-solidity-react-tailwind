import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { construct } from "eth/core";

import abi from "./HookahPortal.json";

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

  const buyHookah = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const hookahPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await hookahPortalContract.getTotalHookah();
        console.log("Retrieved total coffee count...", count.toNumber());

        const hookahTxn = await hookahPortalContract.buyHookah(
          message ? message : "Enjoy Your Hookah",
          name ? name : "Anonymous",
          ethers.utils.parseEther("0.001"),
          {
            gasLimit: 300000,
          }
        );
        console.log("Mining...", hookahTxn.hash);

        toast.info("Sending Fund for coffee...", defaultToast);

        await hookahTxn.wait();

        console.log("Mined -- ", hookahTxn.hash);

        count = await hookahPortalContract.getTotalHookah();

        console.log("Retrieved total hookah count...", count.toNumber());

        setMessage("");
        setName("");

        toast.success("Coffee Purchased!", defaultToast);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      toast.error(`${error.message}`, defaultToast);
    }
  };

  const getAllHookah = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const hookahPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const hookahs = await hookahPortalContract.getAllHookah();

        const hookahCleaned = hookahs.map((hookah) => {
          return {
            address: hookah.giver,
            timestamp: new Date(hookah.timestamp * 1000),
            message: hookah.message,
            name: hookah.name,
          };
        });
        setAllHookah(hookahCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let hookahPortalContract;
    getAllHookah();
    checkIfWalletIsConnected();

    const onNewHookah = (from, timestamp, message, name) => {
      console.log("New Hookah", from, timestamp, message, name);
      setAllHookah((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
          name: name,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      hookahPortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      hookahPortalContract.on("NewHookah", onNewHookah);
    }
    return () => {
      if (hookahPortalContract) {
        hookahPortalContract.off("NewHookah", onNewHookah);
      }
    };
  }, []);

  const handleOnMessageChange = (event) => {
    const { value } = event.target;
    setMessage(value);
  };
  const handleOnNameChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div>
          <title>Mini Buy Me a Hookah</title>
        </div>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold text-blue-600 mb-6">
            Buy Me A Hookah 🚬
          </h1>
          {/*
           * If there is currentAccount render this form, else render a button to connect wallet
           */}

          {currentAccount ? (
            <div className="w-full max-w-xs sticky top-3 z-50 ">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Name"
                    onChange={handleOnNameChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="message"
                  >
                    Send the Creator a Message
                  </label>

                  <textarea
                    className="form-textarea mt-1 block w-full shadow appearance-none py-2 px-3 border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="3"
                    placeholder="Message"
                    id="message"
                    onChange={handleOnMessageChange}
                    required
                  ></textarea>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={buyHookah}
                  >
                    Support 
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full mt-3"
              onClick={connectWallet}
            >
              Connect Your Wallet
            </button>
          )}

          {allHookah.map((hookah, index) => {
            return (
              <div className="border-l-2 mt-10" key={index}>
                <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-blue-800 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
                  {/* <!-- Dot Following the Left Vertical Line --> */}
                  <div className="w-5 h-5 bg-blue-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

                  {/* <!-- Line that connecting the box with the vertical line --> */}
                  <div className="w-10 h-1 bg-green-300 absolute -left-10 z-0"></div>

                  {/* <!-- Content that showing in the box --> */}
                  <div className="flex-auto">
                    <h1 className="text-md">Supporter: {hookah.name}</h1>
                    <h1 className="text-md">Message: {hookah.message}</h1>
                    <h3>Address: {hookah.address}</h3>
                    <h1 className="text-md font-bold">
                      TimeStamp: {hookah.timestamp.toString()}
                    </h1>
                  </div>
                </div>
              </div>
            );
          })}
        </main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}

export default App;
