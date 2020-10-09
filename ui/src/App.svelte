<script>
  import { Content, Grid, Row, Column } from "carbon-components-svelte";
  import Header from "./components/Header.svelte";
  import Theme from "./components/Theme.svelte";
  import TestEmail from "./components/TestEmail.svelte";
  import ContractForm from "./components/ContractForm.svelte";
  import ContractsList from "./components/ContractsList.svelte";
  import DetailsCard from './components/DetailsCard';

  let theme = "g10";
  let address = null;
</script>

<Theme persist bind:theme>
  <Header bind:theme />
  <Content style="background: none; padding: 1rem">
    <Grid>
      <Row>
        <Column lg={address ? 8 : 16} md={address ? 4 : 8}>
          <Row style="padding-bottom: 1rem">
            <Column lg={16}>
              <p>
                This app allows you to monitor Ethereum smart contract events
                and subscribe to/set up emails sent in response to a contract
                event.
              </p>
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

          <Row style="padding-top: 1rem; padding-bottom: 1rem">
            <Column noGutter>
              <ContractsList bind:address />
            </Column>
          </Row>
        </Column>
        {#if address}
          <Column lg=8 md=4>
            <DetailsCard bind:address />
          </Column>
        {/if}
      </Row>
    </Grid>
  </Content>
</Theme>
