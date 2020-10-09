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
    Button,
  } from "carbon-components-svelte";
  import TrashCan32 from "carbon-icons-svelte/lib/TrashCan32";

  const dispatch = createEventDispatcher();
  let newEmail = "";

  async function addEmail() {
    try {
      contract = await fetch(
        `${process.env.API_GATEWAY_URL}/dev/contracts/add-email`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: { address, email: newEmail, eventIndex },
        }
      );
      dispatch("emailAdded"); // refresh list
      newEmail = "";
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteEmail(index) {
    try {
      contract = await fetch(
        `${process.env.API_GATEWAY_URL}/dev/contracts/remove-email`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: { address, eventIndex, emailIndex: index },
        }
      );
      dispatch("emailAdded"); // refresh list
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
  <Row>
    <Column>
      <Row>Subscribed Emails:</Row>
      {#each contractEvent.emails as email, index}
        <Row>
          {email}
          <Button
            icon={TrashCan32}
            hasIconOnly
            kind="danger"
            on:click={() => deleteEmail(index)}>
            Delete
          </Button>
        </Row>
      {/each}
      <TextInput labelText="Add Email" bind:value={newEmail} />
      <Button on:click={addEmail}>Add email address</Button>
    </Column>
  </Row>
</AccordionItem>
