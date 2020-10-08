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
  
  let network = '';
  let name = '';
  let address = '';
  let abi = '';
  
  function submitNewContract() {
    console.log(network, name, abi);
  }
</script>

<Form on:submit={submitNewContract}>
<h2>Enter a contract</h2>
  <FormGroup style="padding: 1rem">
    <Select id="network" labelText="Select network" value="placeholder-item" bind:selected={network}>
      <SelectItem
        hidden
        value=""
        text="Choose an option"
      />
      <SelectItem value="ropsten" text="Ropsten" />
      <SelectItem value="kovan" text="Kovan" />
      <SelectItem value="rinkeby" text="Rinkeby" />
      <SelectItem value="goerli" text="Goerli" />
    </Select>
    
    <TextInput labelText="Contract name" placeholder="Enter contract name..." bind:value={name} />
    <TextInput labelText="Contract address" placeholder="Enter contract address..." bind:value={address} />
    <TextArea labelText="ABI" placeholder="Paste in application binary interface..." bind:value={abi} />
    
    <Button style="margin-top: 1rem" type="submit">Submit</Button>
  </FormGroup>
</Form>