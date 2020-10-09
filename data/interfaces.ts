interface Contract {
  id: string,
  name: string,
  address: string,
  abi: string,
  lastBlockChecked: number,
  events: event[]
}

interface Event {
  name: string,
  inputs: string[],
  emails: email[]
}
