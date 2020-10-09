<script>
  export let address;

  import { onMount } from "svelte";
  import {
    Row,
    TextInput,
    Tag,
    Button,
  } from "carbon-components-svelte";

  let contractList = [];
  let isDetailsCardVisible = false;
  
  // fetch list
  async function fetchContractList() {
    try {
      // contractList = await fetch(
      //   `${process.env.API_GATEWAY_URL}/dev/contracts`,
      //   {
      //     method: "GET",
      //     mode: "cors",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      
      // testing
      contractList = [
        {
          name: "DAI",
          address: "0x3456765432345",
          network: "mainnet",
        },
        {
          name: "wETH",
          address: "0x3456765432345",
          network: "mainnet",
        },
        {
          name: "cDAI",
          address: "0x3456765432345",
          network: "mainnet",
        }
      ]
      
    } catch (error) {
      console.error(error);
    }
  }
  
  function viewContractDetails(_address) {
    // open details card/view
    address = _address;
    isDetailsCardVisible = true
  }

  onMount(() => {
    fetchContractList();
  });
</script>

<h3>Contracts</h3>
{#each contractList as contract}
  <Row style="padding-top: 1rem; padding-bottom: 1rem">
    <TextInput labelText="Name" value={contract.name} readonly />
    <TextInput labelText="Address" value={contract.address} readonly />
    <Tag type="green">{contract.network}</Tag>
    <Button on:click={() => viewContractDetails(contract.address)}>View Details</Button>
  </Row>
{:else}
  <!-- empty list -->
  <p>There are no contracts being monitored</p>
{/each}
<!-- {#if isDetailsCardVisible}
  <DetailsCard bind:address />
{/if} -->
