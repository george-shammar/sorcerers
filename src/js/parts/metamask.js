import 'regenerator-runtime/runtime'
import MetaMaskOnboarding from '@metamask/onboarding'
import contractAddress from "../../contracts/contract-address.json"
import MageArtifact from "../../contracts/Insignia.json";
import { NFTStorage, File } from 'nft.storage'
import { ethers } from "ethers";
import { parseJSON } from 'jquery';

const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
  ? 'http://localhost:9010'
  : undefined

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

// Dapp Status Section
// const networkDiv = document.getElementById('network')
// const chainIdDiv = document.getElementById('chainId')
const accountsDiv = document.getElementById('accounts')

// Basic Actions Section
const onboardButton = document.getElementById('connectButton');
const mintbutton = document.getElementById('mintButton');
const status = document.getElementById("status");
const cid = document.getElementById("cid");
// const getAccountsButton = document.getElementById('getAccounts')
// const getAccountsResults = document.getElementById('getAccountsResult')

const initialize = async () => {
  let onboarding
  try {
    onboarding = new MetaMaskOnboarding({ forwarderOrigin })
  } catch (error) {
    console.error(error)
  }

  let accounts
  // let piggybankContract
  // let accountButtonsInitialized = false

  const accountButtons = [
    // deployButton,
    // depositButton,
    // withdrawButton,
    // sendButton,
    // createToken,
    // transferTokens,
    // approveTokens,
    // transferTokensWithoutGas,
    // approveTokensWithoutGas,
    // signTypedData,
    // getEncryptionKeyButton,
    // encryptMessageInput,
    // encryptButton,
    // decryptButton,
  ]

  const isMetaMaskConnected = () => accounts && accounts.length > 0

  
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress'
    onboardButton.disabled = true
    onboarding.startOnboarding()
  }

  const onClickConnect = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      handleNewAccounts(newAccounts)
    } catch (error) {
      console.error(error)
    }
  }

  
  const updateButtons = () => {
    const accountButtonsDisabled = !isMetaMaskInstalled() || !isMetaMaskConnected()
    if (accountButtonsDisabled) {
      for (const button of accountButtons) {
        button.disabled = true
      }
      // clearTextDisplays()
    } else {
      // deployButton.disabled = false
      // sendButton.disabled = false
      // createToken.disabled = false
      // signTypedData.disabled = false
      // getEncryptionKeyButton.disabled = false
      console.log(".")
    }

    if (!isMetaMaskInstalled()) {
      onboardButton.innerText = 'Click here to install MetaMask!'
      onboardButton.onclick = onClickInstall
      onboardButton.disabled = false
    } else if (isMetaMaskConnected()) {
      onboardButton.innerText = 'Connected'
      onboardButton.disabled = true
      if (onboarding) {
        onboarding.stopOnboarding()
      }
    } else {
      onboardButton.innerText = 'Connect Wallet'
      onboardButton.onclick = onClickConnect
      onboardButton.disabled = false
    }
  }

  
  function handleNewAccounts (newAccounts) {
    accounts = newAccounts
    
    accountsDiv.innerHTML =
    String(accounts).substring(0, 6) +
       "..." +
    String(accounts).substring(38)
    if (isMetaMaskConnected()) {
      // initializeAccountButtons()
    }
    updateButtons()
  }

  
  // function handleNewChain (chainId) {
  //   chainIdDiv.innerHTML = chainId
  // }

  // function handleNewNetwork (networkId) {
  //   networkDiv.innerHTML = networkId
  // }

  async function getNetworkAndChainId () {
    try {
      const chainId = await ethereum.request({
        method: 'eth_chainId',
      })
      // handleNewChain(chainId)

      const networkId = await ethereum.request({
        method: 'net_version',
      })
      // handleNewNetwork(networkId)
    } catch (err) {
      console.error(err)
    }
  }

  updateButtons()

  if (isMetaMaskInstalled()) {

    ethereum.autoRefreshOnNetworkChange = false
    getNetworkAndChainId()

    // ethereum.on('chainChanged', handleNewChain)
    // ethereum.on('networkChanged', handleNewNetwork)
    ethereum.on('accountsChanged', handleNewAccounts)

    try {
      const newAccounts = await ethereum.request({
        method: 'eth_accounts',
      })
      handleNewAccounts(newAccounts)
    } catch (err) {
      console.error('Error on init when getting accounts', err)
    }
  }

}

function metamask() {
  window.addEventListener('DOMContentLoaded', initialize)
}


const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMyNTlEMWEzNTNEMzgyNjQ4MDVmNkY4Y2NjMTY0RThFODQzM0I0MDYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNzkzOTM1Njc5NywibmFtZSI6IkF6YW5pYSJ9.Tn3kou1OKA09gdsp0pduKzFUJGAVQ8KXk1-44pLWH9w";

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const mint = async () => {
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress.Insignia, MageArtifact.abi, signer);
  const mintingPrice= "1200000000000000";
  

  try {
    
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });
    
    status.innerText = 'Creating asset and uploading with nft.storage';
    
    // const metadata = await client.store({
      
    //   name: "Insignia",
    //   description: "Insignia Test Asset",
    //   image: new File(["/assets/images/Insignia-logo.png"], "Insignia-logo.png", { type: "image/jpg"})
      
    // });
    
    
    const metadata = "ipfs://bafyreiav5f2yng46t56vshshfe2llxlzztb6anrywvkk6dutp5si3kp4hq/metadata.json"
    status.innerText = `Minting token with metadata URI: ${metadata}`;
    
    // status.innerText = `Minting token with metadata URI: ${metadata.url}`;
    const metadataURI = metadata;

    // ipfs://bafyreiav5f2yng46t56vshshfe2llxlzztb6anrywvkk6dutp5si3kp4hq/metadata.json
    // const host = "https://nftstorage.link/ipfs/"

    const myArray = metadataURI.split("");
    const last = myArray.length - 1;
    const newArray= myArray.splice(7, last);
    const CID = newArray.join('');
    const finalArray =  "https://nftstorage.link/ipfs/" + `${CID}`
    
    
    const name = "Insignia Test Asset";
    const transaction = await contract.createInsignia(name, metadataURI, { value: mintingPrice });

    status.innerText = "Awaiting confirmation...";

    const receipt = await transaction.wait();
    if (receipt.status === 0) {
        // throw new Error("Transaction failed");
        status.innerText = "Transaction Failed";

    } else {
      // console.log("successful");
      status.innerText = "Congratulations!! Successfully completed.";
      cid.innerText = "Checkout your asset:" + " " + " " + " " + `${finalArray}`;
      
      const exclusive = document.querySelector('#pass');
      exclusive.innerText = "Your exclusive pass to the gaming community"
      exclusive.onclick = function() {
        var redirectWindow = window.open('https://app.niftykit.com/access/c61cf979-e81b-4bba-a4e8-a21c417322a8', '_blank');
        redirectWindow.location;
      };
    }

  } catch (error) {
    if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
      status.innerText = `${error.message}`;
      return;
    }
    console.error(error);
    status.innerText = "error";
  } finally {

  }

}

if (mintbutton != null) {
  mintbutton.onclick = mint;
}


// const items = document.querySelectorAll("list-item");


// function isItemInView(item){
//   let rect = item.getBoundingClientRect();
//   return (
//       rect.top >= 0 &&
//       rect.left >= 0 &&
//       rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//       rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//     );
// }

// function callbackFunc() {
  
//   for (let i = 0; i < items.length; i++) {
//     if (isItemInView(items[i])) {
//       items[i].classList.add("show");
//       console.log(items[i])
//     }
//   }
// }

// window.addEventListener("load", callbackFunc);
// window.addEventListener("resize", callbackFunc);
// window.addEventListener("scroll", callbackFunc);
// const roadmap = document.getElementsByClassName('list-container')
// roadmap.onload = callbackFunc;

// window.addEventListener('DOMContentLoaded', callbackFunc)
export { metamask };