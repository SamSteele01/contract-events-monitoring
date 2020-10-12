<script>
  import { onMount } from "svelte";
  import { Row, Column, TextInput, Tag, Button } from "carbon-components-svelte";
  import superagent from "superagent";
  import DetailsCard from "./DetailsCard";

  let contractList = [];
  let isDetailsCardVisible = false;
  let address;

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

<Row>
  <Column lg={address ? 8 : 16} md={address ? 4 : 8} style="margin-right: 1rem">
    <!-- <Row style="padding-top: 1rem; padding-bottom: 1rem">
      <Column noGutter> -->
        <h3>Contracts</h3>
        <p>Some popular contracts are already entered. Click on "View Details", enter your email in one of the events, and watch how fast it blows up your inbox.</p>
        {#each contractList as contract}
          <Row style="padding-top: 1rem; padding-bottom: 1rem">
            <TextInput labelText="Name" value={contract.name} readonly />
          </Row>
          <Row style="padding-top: 1rem; padding-bottom: 1rem">
            <TextInput labelText="Address" value={contract.address} readonly />
          </Row>
          <Row style="padding-top: 1rem; padding-bottom: 1rem">
            <Tag type="green">{contract.network}</Tag>

            <Button on:click={() => viewContractDetails(contract.address)}>
              View Details
            </Button>
          </Row>
        {:else}
          <!-- empty list -->
          <p>There are no contracts being monitored</p>
        {/each}
      <!-- </Column>
    </Row> -->
  </Column>
  {#if address}
    <Column lg="8" md="4">
      <DetailsCard bind:address />
    </Column>
  {/if}
</Row>
