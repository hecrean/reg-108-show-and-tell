<script lang="ts">
  //Layouts
  import Global from "@/layouts/Global.svelte";
  //Pages
  import Header from "@/components/Header.svelte";
  import IsiFooter from "@/components/ISIFooter.svelte";
  import CaseStudyPage from "@/pages/case-study-page.svelte";
  import LandingPage from "@/pages/landing-page.svelte";
  import { caseStudyStore } from "@/stores/case-studies";
  import { Route, router } from "tinro";
  import Stack from "./layouts/Stack.svelte";

  router.mode.hash();

  import { createSidebarStore } from "@/stores/sidebar.store";
  import PageTransition from "./components/PageTransition.svelte";
  import CaseStudiesPage from "./pages/case-studies-page.svelte";

  const { isOpen: sidebarIsOpen } = createSidebarStore(false);
</script>

<Global>
  <PageTransition>
    <Route path="/*" firstmatch>
      <Route path="/" fallback>
        <Stack>
          <Header slot="header" variant="mininal" />
          <LandingPage slot="main" />
        </Stack>
      </Route>
      <Route path="/case-studies/">
        <!-- <Sidebar open={$sidebarIsOpen}><h1>Sidebar</h1></Sidebar> -->
        <Stack>
          <Header slot="header" variant="full-fat" />
          <CaseStudiesPage slot="main" />
        </Stack>
      </Route>
      <Route path="/case-study/:case-study">
        <!-- <Sidebar open={$sidebarIsOpen}><h1>Sidebar</h1></Sidebar> -->
        <Stack>
          <Header slot="header" variant="full-fat" />
          <CaseStudyPage slot="main" selectedCaseStudy={$caseStudyStore} />
        </Stack>
      </Route>
      <IsiFooter />
    </Route>
  </PageTransition>
</Global>
