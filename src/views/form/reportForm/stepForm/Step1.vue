<template>
  <n-form
    :label-width="90"
    :model="formValue"
    :rules="rules"
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
    <n-form-item label="类型" path="type">
      <n-input-group>
        <n-input
          disabled
          v-model:value="formValue.type"
        />
      </n-input-group>
    </n-form-item>
    <n-form-item label="反馈内容" path="content">
      <n-input disabled type="textarea" v-model:value="formValue.content"/>
    </n-form-item>
    <n-form-item label="反馈时间" path="createdTime">
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


const accountTypeList = [
  {
    label: '微信',
    value: 1,
  },
  {
    label: '支付宝',
    value: 2,
  },
];

const emit = defineEmits(['nextStep']);
const form1Ref: any = ref(null);
const message = useMessage();

const feedbackStore = useFeedbackStore();
const feedBackMessage = feedbackStore.getCurrentFeedBackMessage();
const formValue = reactive({
  userName:'',
  type:'用户反馈',
  content: feedBackMessage.content || '',
  createdTime: moment(feedBackMessage.createdTime).format('YYYY-MM-DD HH:mm:ss')
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
  const userRes = await getUserById(feedBackMessage.userId);
  formValue.userName = formValue.userName.concat(userRes.data.data.item.nickname)
})
</script>
