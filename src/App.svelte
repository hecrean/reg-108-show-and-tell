<script lang="ts">
  //Layouts
  import Global from "@/layouts/Global.svelte";
  //Pages
  import Header from "@/components/Header.svelte";
  import IsiFooter from "@/components/ISIFooter.svelte";
  // import HolyGrail from "@/layouts/HolyGrail.svelte";
  import Stack from "@/layouts/Stack.svelte";
  import CaseStudyPage from "@/pages/case-study-page.svelte";
  import { caseStudyStore } from "@/stores/case-studies";
  import { Route, router } from "tinro";
  import ContentsPage from "./pages/contents-page.svelte";

  router.mode.hash();

  import PageTransition from "./components/PageTransition.svelte";
  import CaseStudiesPage from "./pages/case-studies-page.svelte";
</script>

<Global>
  <PageTransition>
    <Route path="/*" firstmatch>
      <Route path="/" fallback>
        <!-- <EnterSite videoUrl="./animation-video/landing-page-video.mp4" /> -->
        <Stack>
          <Header slot="header" variant="mininal" />
          <ContentsPage slot="main" />
        </Stack>
      </Route>
      <Route path="/case-studies/">
        <Stack>
          <Header slot="header" variant="full-fat" />
          <CaseStudiesPage slot="main" />
        </Stack>
      </Route>
      <Route path="/case-study/:case-study">
        <Stack>
          <Header slot="header" variant="full-fat" />
          <CaseStudyPage slot="main" selectedCaseStudy={$caseStudyStore} />
        </Stack>
      </Route>
      <IsiFooter />
    </Route>
  </PageTransition>
</Global>
