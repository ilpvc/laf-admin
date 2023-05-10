<template>
  <div>
    <n-result status="success" title="处理成功" description="消息将发送给用户" class="step-result">
      <template #default>
        <div class="information">
          <n-grid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <n-gi>用户名</n-gi>
            <n-gi>{{ formValue.userName }}</n-gi>
          </n-grid>
          <n-grid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <n-gi>问题详情</n-gi>
            <n-gi>{{ feedback.content }}</n-gi>
          </n-grid>
          <n-grid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <n-gi>处理结果</n-gi>
            <n-gi>{{ feedback.result }}</n-gi>
          </n-grid>
        </div>
      </template>
    </n-result>
  </div>
</template>

<script lang="ts" setup>
import {defineEmits, onBeforeMount, reactive} from 'vue';
import {useFeedbackStore} from "@/store/modules/feedback";
import {getUserById} from "@/api/user/user";

const emit = defineEmits(['finish', 'prevStep']);

const feedbackStore = useFeedbackStore();
const feedback = feedbackStore.getCurrentFeedBackMessage()
const formValue = reactive({
  userName:'',
})

function prevStep() {
  emit('prevStep');
}

function finish() {
  emit('finish');
}

onBeforeMount(async ()=>{
  const userRes = await getUserById(feedback.userId);
  formValue.userName = formValue.userName.concat(userRes.data.data.item.nickname)
})
</script>

<style lang="less" scoped>
.step-result {
  max-width: 560px;
  margin: 40px auto 0;

  ::v-deep(.n-result-content) {
    background-color: #fafafa;
    padding: 24px 40px;
  }

  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  .money {
    font-family: 'Helvetica Neue', sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
}
</style>
