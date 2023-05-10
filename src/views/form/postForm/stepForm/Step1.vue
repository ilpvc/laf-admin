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
        v-model:value="formValue.userNickname"
      />
    </n-form-item>
    <n-form-item label="帖子类型" path="type">
      <n-input-group>
        <n-select
          disabled
          :options="postType"
          v-model:value="formValue.type"
        />
      </n-input-group>
    </n-form-item>
    <n-form-item label="标题" path="createdTime">
      <n-input disabled v-model:value="formValue.title">
      </n-input>
    </n-form-item>
    <n-form-item label="内容" path="content">
      <n-input disabled type="textarea" v-model:value="formValue.content"/>
    </n-form-item>
    <div style="margin-left: 80px">
      <n-space>
        <n-button type="primary" @click="formSubmit">下一步</n-button>
      </n-space>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import {ref, defineEmits, onBeforeMount, reactive} from 'vue';
import {useMessage} from 'naive-ui';
import {getUserById} from "@/api/user/user";
import {Post} from "@/interface/ApiInterface";
import {usePostStore} from "@/store/modules/post";
import {postType} from "@/views/form/postForm/stepForm/columns";



const emit = defineEmits(['nextStep']);
const form1Ref: any = ref(null);
const message = useMessage();

const postStore = usePostStore();
const post = postStore.getCurrentPost()
const formValue = reactive<Post>({
  ...post,
  userNickname:''
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
  if (post.userId!==undefined){
    const userRes = await getUserById(post.userId);
    formValue.userNickname = formValue.userNickname.concat(userRes.data.data.item.nickname)
  }
})
</script>
