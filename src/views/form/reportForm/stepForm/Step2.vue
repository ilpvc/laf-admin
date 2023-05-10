<template>
  <n-form
    :label-width="90"
    :model="formValue"
    :rules="rules"
    label-placement="left"
    ref="form2Ref"
    style="max-width: 500px; margin: 40px auto 0 80px"
  >
    <n-form-item label="问题详情">
      <span>{{ feedback.content }}</span>
    </n-form-item>
    <n-form-item label="处理结果" path="result">
      <n-input type="textarea" placeholder="填写问题与原因和处理结果"
               v-model:value="formValue.result"/>
    </n-form-item>
    <div style="margin-left: 80px">
      <n-space>
        <n-button :disabled="feedback.status===1" type="primary" :loading="loading" @click="formSubmit">提交</n-button>
        <n-button @click="prevStep">上一步</n-button>
      </n-space>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import {ref, defineEmits} from 'vue';
import {useMessage} from 'naive-ui';
import {useFeedbackStore} from "@/store/modules/feedback";
import {Message} from "@/interface/ApiInterface";
import {updateMessage} from "@/api/message/message";

const form2Ref: any = ref(null);
const message = useMessage();
const loading = ref(false);
const feedbackMessage = useFeedbackStore()
const feedback = feedbackMessage.getCurrentFeedBackMessage()
const formValue = ref({
  result: feedback.result,
});


const rules = {
  result: {
    required: true,
    message: '请输入处理结果',
    trigger: 'blur',
  },
};

const emit = defineEmits(['prevStep', 'nextStep']);

function prevStep() {
  emit('prevStep');
}

function formSubmit() {
  loading.value = true;
  form2Ref.value.validate(async (errors) => {
    if (!errors) {
      const feedback = feedbackMessage.getCurrentFeedBackMessage()
      const message: Message = {...feedback}
      message.result = formValue.value.result
      message.status = 1
      await updateMessage(message)
      feedbackMessage.setCurrentFeedbackMessage(message)
      emit('nextStep');
    } else {
      message.error('验证失败，请填写完整信息');
      loading.value = false
    }
  });
}
</script>
