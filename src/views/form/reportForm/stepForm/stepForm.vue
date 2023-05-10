<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="分步表单">
        用户反馈处理进度
      </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <n-space vertical class="steps" justify="center">
        <n-steps :current="currentTab" :status="currentStatus">
          <n-step title="用户反馈信息" description="检查用户反馈问题" />
          <n-step title="处理用户反馈问题" description="对用户反馈的问题进行处理" />
          <n-step title="完成问题" description="用户反馈问题完成处理" />
        </n-steps>
        <step1 v-if="currentTab === 1" @nextStep="nextStep" />
        <step2 v-if="currentTab === 2" @nextStep="nextStep" @prevStep="prevStep" />
        <step3 v-if="currentTab === 3" @prevStep="prevStep" @finish="finish" />
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
  import { defineComponent, ref } from 'vue';
  import step1 from './Step1.vue';
  import step2 from './Step2.vue';
  import step3 from './Step3.vue';

  const currentTab = ref(1);
  const currentStatus = ref('process');

  function nextStep() {
    if (currentTab.value < 3) {
      currentTab.value += 1;
    }
  }

  function prevStep() {
    if (currentTab.value > 1) {
      currentTab.value -= 1;
    }
  }

  function finish() {
    currentTab.value = 1;
  }
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>
