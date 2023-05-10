<template>
  <n-form
    :label-width="90"
    :model="formValue"
    :rules="rules"
    label-placement="left"
    ref="form2Ref"
    style="max-width: 500px; margin: 40px auto 0 80px"
  >
    <n-form-item label="帖子内容">
      <span>{{ post.content }}</span>
    </n-form-item>
    <n-form-item label="处理结果" path="status">
      <n-select :options="options"
                v-model:value="formValue"/>
    </n-form-item>
    <div style="margin-left: 80px">
      <n-space>
        <n-button :disabled="post.status!==2" type="primary" :loading="loading"
                  @click="formSubmit">提交
        </n-button>
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
import {useReportStore} from "@/store/modules/report";
import {updateReport} from "@/api/report/report";
import {usePostStore} from "@/store/modules/post";
import {updatePost} from "@/api/post/post";

const form2Ref: any = ref(null);
const message = useMessage();
const loading = ref(false);
const postStore = usePostStore();
const post = postStore.getCurrentPost()
const formValue = ref(
   post.status
);

const options = [
  {
    label:'审核中',
    value: 2
  },
  {
    label: '审核通过',
    value: 1
  },
  {
    label: '审核失败',
    value: 4
  },
]

const rules = {
  status: {
    required: false,
    message: '请选择',
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
      if (formValue.value!==2){
        post.status=formValue.value
        await updatePost(post)
        postStore.setCurrentPost(post)
        emit('nextStep');
      }else {
        loading.value=false
        message.error('请选择审核结果')
      }

    } else {
      console.log(formValue)
      message.error('验证失败，请填写完整信息');
      loading.value = false
    }
  });
}
</script>
