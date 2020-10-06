const contract = {
  id: string,
  name: string,
  abi: string,
  lastBlockChecked: number,
  events: event[]
}

const event = {
  name: string,
  fields: string[],
  emails: email[]
}