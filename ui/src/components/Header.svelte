<script>
  export let theme = "g10";

  import {
    Column,
    SkipToContent,
    Header,
    HeaderUtilities,
    HeaderGlobalAction,
    HeaderAction,
    HeaderPanelLinks,
    HeaderPanelDivider,
    HeaderPanelLink,
    SideNav,
    SideNavItems,
    SideNavLink,
    SideNavMenu,
    SideNavMenuItem,
    Select,
    SelectItem,
  } from "carbon-components-svelte";
  import Notification20 from "carbon-icons-svelte/lib/Notification20";
  import UserAvatar20 from "carbon-icons-svelte/lib/UserAvatar20";
  import AppSwitcher20 from "carbon-icons-svelte/lib/AppSwitcher20";
  import { getContext } from "svelte";

  const ctx = getContext("Theme");
  let displaySwitcher = false;
  let isSideNavOpen = false;
  let isOpen = false;

  $: if (ctx) {
    ctx.dark.subscribe((value) => {
      console.log("dark mode?", value);
    });
    ctx.light.subscribe((value) => {
      console.log("light mode?", value);
    });
    ctx.updateVar("--cds-productive-heading-06-font-size", "4rem");
  }

  function toggleSwitcher() {
    displaySwitcher = !displaySwitcher;
  }
</script>

<Header
  company="OpenZeppelin"
  platformName="Contract Events Monitor"
  bind:isSideNavOpen>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
  <HeaderUtilities>
    <HeaderGlobalAction aria-label="Notifications" icon={Notification20} />
    <HeaderGlobalAction aria-label="User Avatar" icon={UserAvatar20} />
    <!-- <HeaderGlobalAction aria-label="App Switcher" icon="{AppSwitcher20}" on:toggle={toggleSwitcher} /> -->
    <HeaderAction bind:isOpen>
    <Column lg="{2}">
      <Select
      labelText="Carbon theme"
      bind:selected={theme}
      style="margin-bottom: 1rem"
      >
        <SelectItem value="white" text="White" />
        <SelectItem value="g10" text="Gray 10" />
        <SelectItem value="g90" text="Gray 90" />
        <SelectItem value="g100" text="Gray 100" />
      </Select>
    </Column>
      <HeaderPanelLinks>
        <!-- <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
        <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
        <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
        <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 5</HeaderPanelLink> -->
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <SideNavLink text="Contracts" />
    <SideNavLink text="Link 2" />
    <SideNavLink text="Link 3" />
    <!-- <SideNavMenu text="Menu">
      <SideNavMenuItem href="/" text="Link 1" />
      <SideNavMenuItem href="/" text="Link 2" />
      <SideNavMenuItem href="/" text="Link 3" />
    </SideNavMenu> -->
  </SideNavItems>
</SideNav>
