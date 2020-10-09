<script>
  export let address;

  import { onMount } from "svelte";
  import {
    Accordion,
    AccordionItem,
    Column,
    Row,
    TextInput,
    Button,
  } from "carbon-components-svelte";
  import EventItem from './EventItem'

  let contract = null;

  // fetch list
  async function fetchContractDetails() {
    try {
      // contract = await fetch(
      //   `${process.env.API_GATEWAY_URL}/dev/contracts/${address}`,
      //   {
      //     method: "GET",
      //     mode: "cors",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      
      // testing
      contract = {
          name: "DAI",
          address: "0x3456765432345",
          network: "mainnet",
          events: [
            {
              name: "Send",
              inputs: [
                {
                  name: "toAddress",
                  type: "address"
                },
                {
                  name: "fromAddress",
                  type: "address"
                }
              ],
              emails: [
                "test@test.com",
                "joe@blow.com",
                "dave@hodle.com"
              ]
            }
          ]
      }
    } catch (error) {
      console.error(error);
    }
  }

  function closeDetailsCard() {
    address = null;
  };
  
  function handleMessage(event) {
    console.log('EVENT', event);
    fetchContractDetails();
  };

  onMount(() => {
    fetchContractDetails();
  });
  
</script>

{#if contract}
  <h3>{contract.name}</h3>
  <Button on:click={closeDetailsCard}>Close</Button>
  <TextInput labelText="Network" value={contract.network} readonly />
  <TextInput labelText="Address" value={contract.address} readonly />

  <Accordion>
    {#each contract.events as contractEvent, index}
      <EventItem {address} {contractEvent} eventIndex={index} on:message={handleMessage} />
    {/each}
  </Accordion>
{/if}
