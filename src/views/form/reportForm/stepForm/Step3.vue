<template>
  <div>
    <n-result status="success" title="审核完成" description="审核结果将发送给用户" class="step-result">
      <template #default>
        <div class="information">
          <n-grid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <n-gi>用户名</n-gi>
            <n-gi>{{ formValue.userName }}</n-gi>
          </n-grid>
          <n-grid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <n-gi>帖子</n-gi>
            <n-gi>{{ formValue.post }}</n-gi>
          </n-grid>
          <n-grid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <n-gi>举报原因</n-gi>
            <n-gi>{{ report.content }}</n-gi>
          </n-grid>
          <n-grid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <n-gi>处理结果</n-gi>
            <n-gi>{{ report.status===2?'举报成功':'举报失败' }}</n-gi>
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
import {useReportStore} from "@/store/modules/report";
import {getPostById, updatePost} from "@/api/post/post";
import {addMessage} from "@/api/message/message";
import {Post} from "@/interface/ApiInterface";

const emit = defineEmits(['finish', 'prevStep']);

const reportStore = useReportStore();
const report = reportStore.getCurrentReport()
const formValue = reactive({
  userName:'',
  post:''
})

function prevStep() {
  emit('prevStep');
}

function finish() {
  emit('finish');
}

onBeforeMount(async ()=>{
  const userRes = await getUserById(report.userId);
  formValue.userName = formValue.userName.concat(userRes.data.data.item.nickname)
  const postRes = await getPostById(report.postId)
  formValue.post = formValue.post.concat(postRes.data.data.item.title)
  if (report.status===2){
    let post:Post =postRes.data.data.item
    post.status=4
    await updatePost(post)
    await addMessage({type:2,content:'你的帖子 '+formValue.post+'被举报成功,已禁用 ',userId:post.userId})
  }
  await addMessage({type:2,content:'你举报的帖子 '+formValue.post+' '+(report.status===2?'举报成功':'举报失败'),userId:report.userId})
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
