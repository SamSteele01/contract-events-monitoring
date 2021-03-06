// import { readFileSync } from 'fs';

// const ABI = readFileSync('../contracts/DAI/ABI.json');
// const ABIjs = JSON.parse(ABI.toString());
// console.log('ABIJS type', typeof ABIjs);


import { ABIjs } from '../contracts/DAI/ABI.js';
console.log('ABI type', typeof ABIjs);

const events = ABIjs.filter(obj => obj.type === 'event');

const readEvents = events.map((event) => ({
  name: event.name,
  inputs: event.inputs,
}));

console.log('EVENTS', JSON.stringify(readEvents, null, 2));
