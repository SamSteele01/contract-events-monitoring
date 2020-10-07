<script>
  let email = "";
  let message = "";

  import { TextInput, Button } from "carbon-components-svelte";

  function postTestEmail() {
    // validate
    // send
    console.log(email, message);
    email = "";
    message = "";
  }
</script>

<h2>Test email address</h2>
<div style="padding: 1rem">
    <TextInput labelText="Email" placeholder="Enter email address..." bind:value={email} />
    <TextInput labelText="Message" placeholder="Enter message to send..." bind:value={message} />
    <Button style="margin-top: 1rem" on:click={postTestEmail}>Send test email</Button>
</div>