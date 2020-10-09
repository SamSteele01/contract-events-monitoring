<script>
  let email = "";
  let message = "";

  import { TextInput, Button, Row } from "carbon-components-svelte";

  async function postTestEmail() {
    // validate
    // send
    console.log(email, message);

    const response = await fetch(
      `${process.env.API_GATEWAY_URL}/dev/test-email`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      }
    );

    email = "";
    message = "";
    console.log(response.json());
  }
</script>

<h3>Test email address</h3>
<div style="padding: 1rem">

    <TextInput
      labelText="Email"
      placeholder="Enter email address..."
      bind:value={email} />

    <TextInput
      labelText="Message"
      placeholder="Enter message to send..."
      bind:value={message} />

    <Button style="margin-top: 1rem" on:click={postTestEmail}>
      Send test email
    </Button>

</div>
