import 'regenerator-runtime/runtime'
import MetaMaskOnboarding from '@metamask/onboarding'
import contractAddress from "../../contracts/sorcerer-address.json"
import LeaderboardAddress from "../../contracts/leaderboard-address.json";
import SorcererABI from "../../contracts/Sorcerer.json";
import ABI from "../../contracts/Leaderboard.json";
import SocialReward from "../../contracts/sorcererReward-address.json";
import RewardABI from "../../contracts/SorcererReward.json";
import { ethers } from "ethers";

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
const leaderboardbutton = document.getElementById('refresh-board');
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
    localStorage.setItem('accounts', JSON.stringify(accounts));
    
    accountsDiv.innerHTML =
    String(accounts).substring(0, 6) +
       "..." +
    String(accounts).substring(38)
    if (isMetaMaskConnected()) {
      // initializeAccountButtons()
    }
    updateButtons()
  }

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

const mint = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  try {
    const contract = new ethers.Contract(contractAddress.Sorcerer, SorcererABI.abi, signer);

    status.innerText = "Minting game asset to your address";
    const transaction = await contract.mintTo();
    status.innerText = "Awaiting confirmation...";
    const receipt = await transaction.wait();
    if (receipt.status === 0) {
        status.innerText = "Transaction Failed";
    } else {
      status.innerText = "Congratulations!! Successfully completed.";
      cid.innerText = "If you haven't already, await instruction to download Sorcerer.";
    }
  } catch (error) {
    console.error("Error minting asset:", error);
  }
}

if (mintbutton != null) {
  mintbutton.onclick = mint;
}

// ================ Leaderboard's stuff ===========================
const getLeaderboard = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  try {
    const contract = new ethers.Contract(LeaderboardAddress.Leaderboard, ABI.abi, provider);
    const [addresses, scores] = await contract.getRankings();

    const leaderboardContainer = document.getElementById('leaderboard-container');

    leaderboardContainer.innerHTML = '';

    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      const score = scores[i];

      // Format the address string
      const formattedAddress = String(address).substring(0, 6) + "..." + String(address).substring(38);

      const entryDiv = document.createElement('div');
      entryDiv.classList.add('nk-social-friends-content');

      const addressInfoDiv = document.createElement('div');
      addressInfoDiv.classList.add('nk-social-friends-info');

      const addressNameDiv = document.createElement('div');
      addressNameDiv.classList.add('nk-social-friends-name');

      const addressElement = document.createElement('p');
      addressElement.textContent = formattedAddress; // Use the formatted address
      addressElement.id = 'board-address';

      addressNameDiv.appendChild(addressElement);
      addressInfoDiv.appendChild(addressNameDiv);

      const scoreActionsDiv = document.createElement('div');
      scoreActionsDiv.classList.add('nk-social-friends-actions');

      const scoreElement = document.createElement('p');
      scoreElement.textContent = `${score} Points`; // Include "Points" after the score
      scoreElement.classList.add('nk-btn', 'nk-btn-xs', 'link-effect-4');
      scoreElement.id = 'score';

      scoreActionsDiv.appendChild(scoreElement);

      entryDiv.appendChild(addressInfoDiv);
      entryDiv.appendChild(scoreActionsDiv);

      leaderboardContainer.appendChild(entryDiv);
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
};

if (leaderboardbutton != null) {
  leaderboardbutton.onclick = getLeaderboard;
}

// ================ Social Registeration stuff ===========================
const mintProfile = async (address, username, avatar) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const status = document.getElementById("profile-mint-status");
  try {
    const contract = new ethers.Contract(SocialReward.SocialReward, RewardABI.abi, signer);
    status.innerText = "Wait! We're minting your Profile.";
    const uri = "https"
    const transaction = await contract.mintProfile(address, username, avatar, uri);
    status.innerText = "Awaiting confirmation...";
    const receipt = await transaction.wait();
    if (receipt.status === 0) {
        status.innerText = "Transaction Failed";
    } else {
      status.innerText = "Congratulations!! Successfully completed.";
    }
  } catch (error) {

  }
};

document.getElementById("registerButton").addEventListener("click", function(event) {
  event.preventDefault();
  
  const usernameInput = document.getElementById("nft-username");
  const avatarInput = document.getElementById("nft-avatar");

  const username = usernameInput.value;
  const avatarUrl = avatarInput.value;
  const connectedAccount = localStorage.getItem('accounts');
  let address;
  if (connectedAccount) {
    address = JSON.parse(connectedAccount);
    mintProfile(address[0], username, avatarUrl)
  }

  usernameInput.value = "";
  avatarInput.value = "";
});

// ================ Activate Reward Stuff ===========================
// const activateReward = async (recipients, creator, amount) => {
const activateReward = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  // const rewardButton = document.getElementById("reward");
  const status = document.getElementById("reward_status");
  try {
    const contract = new ethers.Contract(SocialReward.SocialReward, RewardABI.abi, signer);
    status.innerText = "Activating payout...";
    // =========
    const recipients = ["0x99aD37e023bd1599767b4d127d38ED3af21Df385", "0x992738165df4e52D28d02661F8050FdD530B7f87", "0x909045516Ee992b9A8FF98b2613CE71e2b2B91ad"]
    const connectedAccount = localStorage.getItem('accounts');
    let address;
    if (connectedAccount) {
      address = JSON.parse(connectedAccount);
      const creator = address[0]
      const transaction = await contract.distributeRewards(recipients, creator, 1000);
      status.innerText = "Awaiting confirmation...";
      const receipt = await transaction.wait();
      if (receipt.status === 0) {
        status.innerText = "Transaction Failed";
      } else {
        status.innerText = "Congratulations!! Reward activation successfull.";
      }
    }
   
    // =========
    // const transaction = await contract.distributeRewards(recipients, creator, amount);
  } catch (error) {

  }
};

const rewardActivatebutton = document.getElementById("reward");
if (rewardActivatebutton != null) {
  rewardActivatebutton.onclick = activateReward;
}

export { metamask };