export interface Contract {
  id: string,
  name: string,
  address: string,
  abi: string,
  lastBlockChecked: number,
  events: Event[]
}

export interface Event {
  name: string,
  inputs: string[],
  emails: string[]
}

export interface ABIobj {
  type: string
}