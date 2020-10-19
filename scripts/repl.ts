/* to serve as the start of writing actual tests with Jest or eq */

// let num = 42;
// console.log(typeof num);

// const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
// const email = 'ssteele017@gmail.com';
// console.log(regex.test(email));
// 
// const badEmail = 's$teele017@gmail.com';
// console.log(regex.test(badEmail));

// let address = '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643';
// console.log('ADDRESS', address.toLowerCase());
//
// console.log(address.includes('0x'));
// 
// const regex = /[0-9xA-Fa-f]+/
// console.log(regex.test(address));

// const eventHashes = ['asdfg', 'zxcvbnm', 'qwertyuiop'];
// 
// const linksForText = eventHashes.reduce((_acc: string, eventHash) => {
//   return _acc += `https://etherscan.io/tx/${eventHash} \n `
// }, '');
// console.log('LINKSFORTEXT', linksForText);

const contractDbItems = [1, 2, 3, 4, 5];

async function updateLastBlockChecked(contractAddress: number, errorTries: number) {
  const value = Math.random();

  if (value > 0.95) {
    return `UPDATELASTBLOCKCHECKED SUCCESS ${contractAddress}`;
  } else {
    if (errorTries > 20) {
      // call recursively until it succedes. If there are DB connection issues we may have bigger problems.
      return `UPDATELASTBLOCKCHECKED ERROR: Contract address ${contractAddress} was not updated with lastBlockChecked`;
    } else {
      errorTries += 1;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(updateLastBlockChecked(contractAddress, errorTries));
        }, 15);
      });
    }
  }
}

let updateBlockNumberPromises = [];

contractDbItems.forEach(contract => {
  updateBlockNumberPromises.push(updateLastBlockChecked(contract, 0));
});

Promise.all(updateBlockNumberPromises).then((logs: string[]) => {
  logs.forEach(log => console.log(log));
})

