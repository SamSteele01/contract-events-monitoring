/* initial thoughts for checking all networks, not just mainnet */
import Web3 from "web3";

const networks = ['mainnet', 'ropsten', 'kovan', 'rinkeby', 'goerli']; // add testnets

let processEventsFromNetworkPromises = [];
// look up each network, one at a time
networks.forEach(network => {
  const web3 = new Web3(`https://${network}.infura.io/v3/e18137a5d4fe454fa1ec85f00d56b3b0`); // url
  // fire function
  processEventsFromNetworkPromises.push(getLatestEventsAndProcess(web3)); // this function would be everything below
})
Promise.all(processEventsFromNetworkPromises).then(networks => {
  console.log('NETWORKS', networks);
  // process.exit();
})