<script>
  export let address;
  export let contractEvent;
  export let eventIndex;

  import { onMount, createEventDispatcher } from "svelte";
  import {
    AccordionItem,
    Column,
    Row,
    TextInput,
    Button
  } from "carbon-components-svelte";
  import TrashCan32 from "carbon-icons-svelte/lib/TrashCan32";

  const dispatch = createEventDispatcher();
  let newEmail = "";

  async function addEmail() {
    try {
      const response = await fetch(
        `${process.env.API_GATEWAY_URL}/dev/contracts/add-email`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ address, email: newEmail, eventIndex })
        }
      );
      dispatch("emailChange", {}); // refresh list
      newEmail = "";
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteEmail(email) {
    try {
      const response = await fetch(
        `${process.env.API_GATEWAY_URL}/dev/contracts/remove-email`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ address, eventIndex, email })
        }
      );
      dispatch("emailChange", {}); // refresh list
    } catch (error) {
      console.error(error);
    }
  }
</script>

<AccordionItem title={contractEvent.name}>
  <Row>
    <Column>
      Inputs:
      {#each contractEvent.inputs as input}
        <p>{input.name} : {input.type}</p>
      {/each}
    </Column>
  </Row>
  <Row style="margin-top: 1rem">
    <Column>
      <Row>Subscribed Emails:</Row>
      {#each contractEvent.emails as email, index}
        <Row style="justify-content: space-between">
          {email}
          <Button
            icon={TrashCan32}
            hasIconOnly
            tooltipPosition="bottom"
            tooltipAlignment="center"
            iconDescription="Remove Email"
            kind="danger"
            on:click={() => deleteEmail(email)}>
          </Button>
        </Row>
      {/each}
      <TextInput labelText="Add Email" bind:value={newEmail} />
      <Button on:click={addEmail}>Add email address</Button>
    </Column>
  </Row>
</AccordionItem>
