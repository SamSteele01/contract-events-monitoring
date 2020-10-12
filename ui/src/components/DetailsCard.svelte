<script>
  export let address;

  import { onMount } from "svelte";
  import {
    Accordion,
    AccordionItem,
    Button,
    Column,
    Row,
    TextInput
  } from "carbon-components-svelte";
  import superagent from "superagent";
  import EventItem from "./EventItem";

  let contract = null;

  async function fetchContractDetails() {
    try {
      const response = await superagent
        .get(`${process.env.API_GATEWAY_URL}/dev/contracts/${address}`)
        .set("Content-Type", "application/json");

      console.log("RESPONSE", response.body);
      contract = response.body.Item;
    } catch (error) {
      console.error(error);
    }
  }

  function closeDetailsCard() {
    address = null;
  }

  function handleEmailChange(event) {
    console.log("EVENT", event);
    fetchContractDetails();
  }

  onMount(() => {
    fetchContractDetails();
  });

  // TODO: add createdAt & updatedAt fields to DOMs
</script>

{#if contract}
  <Row style="margin-top: 1rem">
    <Column sm={1} md={4} lg={8} style="padding: 0">
      <h3>{contract.name}</h3>
    </Column>
    <Column sm={1} md={2} lg={4} style="padding: 0" />
    <Column sm={1} md={1} lg={1} style="padding: 0">
      <Button kind="secondary" on:click={closeDetailsCard}>Close</Button>
    </Column>
  </Row>
  <Row style="margin-top: 1rem">
    <TextInput
      labelText="Network"
      value={contract.network}
      readonly />
  </Row>
  <Row style="margin-top: 1rem">
    <TextInput labelText="Address" value={contract.address} readonly />
  </Row>
  <Row style="margin-top: 1rem; margin-bottom: 1rem">
    <label class="bx--label">Events</label>
    <Accordion>
      {#each contract.events as contractEvent, index}
        <EventItem
          {address}
          {contractEvent}
          eventIndex={index}
          on:emailChange={handleEmailChange} />
      {/each}
    </Accordion>
  </Row>
{/if}
