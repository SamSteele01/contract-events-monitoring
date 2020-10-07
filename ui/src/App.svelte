<script>
  import {
    Content,
    // Breadcrumb,
    // BreadcrumbItem,
    Grid,
    Row,
    Column,
    // Tabs,
    // TabContent,
    // Tab,
    // Select,
    // SelectItem
  } from "carbon-components-svelte";
  import Header from "./components/Header.svelte";
  import Theme from "./components/Theme.svelte";
  import TestEmail from "./components/TestEmail.svelte";
  import ContractForm from "./components/ContractForm.svelte";

  let theme = "g10";
</script>


<Theme persist bind:theme>
  <Header bind:theme />
  <Content style="background: none; padding: 1rem">
    <Grid>
      <Row style="padding-bottom: 1rem">
        <Column lg="{16}">
          <p>This app allows you to monitor Ethereum smart contract events and subscribe to/set up emails sent in response to a contract event.</p>
        </Column>
      </Row>
      
      <Row style="padding-top: 1rem; padding-bottom: 1rem">
        <Column noGutter>
          <TestEmail />
        </Column>
      </Row>

      <Row style="padding-top: 1rem; padding-bottom: 1rem">
        <Column noGutter>
          <ContractForm />
        </Column>
      </Row>
    </Grid>
  </Content>
</Theme>
