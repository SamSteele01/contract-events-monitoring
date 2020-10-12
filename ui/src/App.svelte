<script>
  import { Content, Grid, Row, Column } from "carbon-components-svelte";
  import router from "page";
  import Header from "./components/Header.svelte";
  import Theme from "./components/Theme.svelte";
  import Home from "./components/Home.svelte";
  import TestEmail from "./components/TestEmail.svelte";
  import ContractForm from "./components/ContractForm.svelte";
  import ContractsList from "./components/ContractsList.svelte";

  let theme = "g10";
  let address = null;
  let page;

  router("/", () => (page = Home));
  router("/email", () => (page = TestEmail));
  router("/new-contract", () => (page = ContractForm));
  router("/contract-list", () => (page = ContractsList));

  router.start();
</script>

<Theme persist bind:theme>
  <Header bind:theme />
  <Content style="background: none; padding: 1rem">
    <Grid >
      <svelte:component this={page} />
    </Grid>
  </Content>
</Theme>
