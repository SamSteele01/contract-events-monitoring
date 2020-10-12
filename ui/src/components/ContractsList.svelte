<script>
  export let address;

  import { onMount } from "svelte";
  import { Row, TextInput, Tag, Button } from "carbon-components-svelte";
  import superagent from "superagent";

  let contractList = [];
  let isDetailsCardVisible = false;

  // fetch list
  async function fetchContractList() {
    try {
      const response = await superagent
        .get(`${process.env.API_GATEWAY_URL}/dev/contracts`)
        .set("Content-Type", "application/json");

      console.log("CONTRACTLIST body", response.body);
      contractList = response.body.Items;
    } catch (error) {
      console.error(error);
    }
  }

  function viewContractDetails(_address) {
    // open details card/view
    address = _address;
    isDetailsCardVisible = true;
  }

  onMount(() => {
    fetchContractList();
  });
</script>

<h3>Contracts</h3>
{#each contractList as contract}
  <Row style="padding-top: 1rem; padding-bottom: 1rem">
    <TextInput labelText="Name" value={contract.name} readonly />
  </Row>
  <Row style="padding-top: 1rem; padding-bottom: 1rem">
    <TextInput labelText="Address" value={contract.address} readonly />
  </Row>
  <Row style="padding-top: 1rem; padding-bottom: 1rem" >
    <Tag type="green">{contract.network}</Tag>
    
    <Button on:click={() => viewContractDetails(contract.address)}>
      View Details
    </Button>
  </Row>
{:else}
  <!-- empty list -->
  <p>There are no contracts being monitored</p>
{/each}
<!-- {#if isDetailsCardVisible}
  <DetailsCard bind:address />
{/if} -->
