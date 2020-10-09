<script>
  import {
    Form,
    FormGroup,
    Checkbox,
    RadioButtonGroup,
    RadioButton,
    Select,
    SelectItem,
    TextArea,
    TextInput,
    Button,
  } from "carbon-components-svelte";

  let network = "";
  let name = "";
  let address = "";
  let abi = "";

  async function submitNewContract() {
    console.log(network, name, address, abi);
    try {
      const response = await fetch(
        `${process.env.API_GATEWAY_URL}/dev/contracts`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ network, name, address, abi })
        }
      );
       network = "";
       name = "";
       address = "";
       abi = "";
    } catch (error) {
      console.log('submitNewContract ERROR', error);
    }
  }
  
</script>

<Form on:submit={submitNewContract}>
  <h3>Enter a contract</h3>
  <FormGroup style="padding: 1rem">
    <Select
      id="network"
      labelText="Select network"
      value="placeholder-item"
      bind:selected={network}>
      <SelectItem hidden value="" text="Choose an option" />
      <SelectItem value="mainnet" text="Mainnet" />
      <SelectItem value="ropsten" text="Ropsten" />
      <SelectItem value="kovan" text="Kovan" />
      <SelectItem value="rinkeby" text="Rinkeby" />
      <SelectItem value="goerli" text="Goerli" />
    </Select>

    <TextInput
      labelText="Contract name"
      placeholder="Enter contract name..."
      bind:value={name} />
    <TextInput
      labelText="Contract address"
      placeholder="Enter contract address..."
      bind:value={address} />
    <TextArea
      labelText="ABI"
      placeholder="Paste in application binary interface..."
      bind:value={abi} />

    <Button style="margin-top: 1rem" type="submit">Submit</Button>
  </FormGroup>
</Form>
