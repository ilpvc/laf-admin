<template>
  <n-form
    :label-width="90"
    :model="formValue"
    label-placement="left"
    ref="form1Ref"
    style="max-width: 500px; margin: 40px auto 0 80px"
  >
    <n-form-item label="用户名" path="userName">
      <n-input
        disabled
        v-model:value="formValue.userName"
      />
    </n-form-item>
    <n-form-item label="被举报帖子" path="type">
      <n-input-group>
        <n-input
          disabled
          v-model:value="formValue.post"
        />
      </n-input-group>
    </n-form-item>
    <n-form-item label="举报原因" path="content">
      <n-input disabled type="textarea" v-model:value="formValue.content"/>
    </n-form-item>
    <n-form-item label="举报时间" path="createdTime">
      <n-input disabled v-model:value="formValue.createdTime">
      </n-input>
    </n-form-item>
    <div style="margin-left: 80px">
      <n-space>
        <n-button type="primary" @click="formSubmit">下一步</n-button>
      </n-space>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import {ref, defineEmits, unref, onBeforeMount, reactive} from 'vue';
import {useMessage} from 'naive-ui';
import {useFeedbackStore} from "@/store/modules/feedback";
import moment from "moment";
import {getUserById} from "@/api/user/user";
import {useReportStore} from "@/store/modules/report";
import {getPostById} from "@/api/post/post";



const emit = defineEmits(['nextStep']);
const form1Ref: any = ref(null);
const message = useMessage();

const reportStore = useReportStore();
const report = reportStore.getCurrentReport()
const formValue = reactive({
  userName:'',
  post:'',
  content: report.content || '',
  createdTime: moment(report.createdTime).format('YYYY-MM-DD HH:mm:ss')
});


function formSubmit() {
  form1Ref.value.validate((errors) => {
    if (!errors) {
      emit('nextStep');
    } else {
      message.error('验证失败，请填写完整信息');
    }
  });
}

onBeforeMount(async ()=>{
  if (report.userId!==undefined&&report.postId!==undefined){
    const userRes = await getUserById(report.userId);
    formValue.userName = formValue.userName.concat(userRes.data.data.item.nickname)
    const postRes = await getPostById(report.postId)
    formValue.post = formValue.post.concat(postRes.data.data.item.title)
  }
})
</script>
