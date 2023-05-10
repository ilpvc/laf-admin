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
            <n-gi>帖子标题</n-gi>
            <n-gi>{{ post.title }}</n-gi>
          </n-grid>
          <n-grid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <n-gi>帖子内容</n-gi>
            <n-gi>{{ post.content }}</n-gi>
          </n-grid>
          <n-grid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <n-gi>处理结果</n-gi>
            <n-gi>{{ post.status===1?'审核通过':'审核失败' }}</n-gi>
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
import {getPostById} from "@/api/post/post";
import {addMessage} from "@/api/message/message";
import {usePostStore} from "@/store/modules/post";

const emit = defineEmits(['finish', 'prevStep']);

const postStore = usePostStore();
const post = postStore.getCurrentPost()
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
  const userRes = await getUserById(post.userId);
  formValue.userName = formValue.userName.concat(userRes.data.data.item.nickname)
  if (post.status===1){
    await addMessage({type:2,content:'你的帖子 '+post.title+'审核通过,发布成功',userId:post.userId})
  }else {
    await addMessage({type:2,content:'你的帖子 '+post.title+'审核不通过,发布失败',userId:post.userId})
  }

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
