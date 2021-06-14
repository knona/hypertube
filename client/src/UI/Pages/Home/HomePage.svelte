<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { SegmentedControlSegment } from '../../Components/SegementedControl/Models/SegmentedControlSegment';
  import SegmentedControl from '../../Components/SegementedControl/SegmentedControl.svelte';
  import HomePageSection from './Components/HomePageSection/HomePageSection.svelte';
  import { AllHomePageSectionType, HomePageSectionType } from './Components/HomePageSection/Models/HomePageSectionType';

  let selectedSegment: SegmentedControlSegment<HomePageSectionType> = segments()[0];

  function segments(): SegmentedControlSegment<HomePageSectionType>[] {
    return AllHomePageSectionType.map(type => ({
      value: type,
      localized: $_(`page.home.segmentedControl.${type}`) as string
    }));
  }
</script>

<div class="relative pt-32 md:pt-20">
  <div class="pb-4 v-stack items-center justify-center">
    <SegmentedControl segments={segments()} bind:selectedSegment />
  </div>
  <HomePageSection type={selectedSegment.value} />
</div>
