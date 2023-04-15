<template>
  <div class="mt-4">
    <NRow :gutter="24">
      <NCol :span="24">
        <n-card content-style="padding: 0;" :bordered="false">
          <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
            <n-tab-pane name="总帖数">
              <VisitAmount />
              <!--              <FluxTrend />-->
            </n-tab-pane>
            <n-tab-pane name="访问量">
              <VisitAmount />
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </NCol>
    </NRow>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import VisitAmount from './VisitAmount.vue';

  export default defineComponent({
    components: { VisitAmount },
    setup() {
      return {};
    },
  });
</script>
