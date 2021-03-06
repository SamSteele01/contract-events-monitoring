import Web3 from 'web3';

export function validateAddress(address: string): void | Error {
  if (!address) {
    throw new Error('Address is required.');
  }
  if (address.length !== 42) {
    throw new Error('Address is not valid.');
  };
  if (typeof address !== 'string') {
    throw new Error('Address must be a string.');
  }
  const regex = /^0x[a-fA-F0-9]{40}$/
  if (!regex.test(address)) {
    throw new Error('Not a valid Ethereum address')
  }
  if (address !== Web3.utils.toChecksumAddress(address)) {
    throw new Error('Address must be checksummed.')
  }
}

export function validateEmail(email: string): void | Error {
  const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  if (!email) {
    throw new Error('Email is required.');
  }
  if (typeof email !== 'string') {
    throw new Error('Email must be a string.');
  }
  if (!regex.test(email)) {
    throw new Error('Email must be a valid email address.');
  }
}

export function validateNumber(name: string, number: number): void | Error {
  if (typeof number !== 'number') {
    throw new Error(`${name} must be a number`);
  }
}

export function validateString(name: string, value: string): void | Error {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  if (typeof value !== 'string') {
    throw new Error(`${name} must be a string`);
  }
}