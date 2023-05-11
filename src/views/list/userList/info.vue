<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="用户详情"> 用户详情页面,可以修改用户信息 </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <div class="BasicForm">
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
          <template #statusSlot="{ model, field }">
            <n-input v-model:value="model[field]" />
          </template>
        </BasicForm>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">

import {onBeforeMount, reactive, ref, unref} from "vue";
import {User} from "@/interface/ApiInterface";
import {getUserById, updateUser} from "@/api/user/user";
import {useRoute} from "vue-router";
import {BasicForm, useForm} from "@/components/Form";
import {schemas} from "@/views/list/userList/schemas";
import {useMessage} from 'naive-ui'

const message = useMessage();

const [register, {}] = useForm({
  gridProps: { cols: 1 },
  collapsedRows: 3,
  labelWidth: 120,
  layout: 'horizontal',
  submitButtonText: '修改',
  schemas,
});

function handleSubmit(values: Recordable) {
  user.value = Object.assign(unref(user),unref(values))
  updateUser(unref(user))
  message.success('更新成功')
}

function handleReset(values: Recordable) {
  console.log(values);
}



const route = useRoute();
const user = ref<User>({})
onBeforeMount(async () => {
  const userRes = await getUserById(route.params.id);
  console.log(userRes)
  user.value = userRes.data.data.item
  console.log(unref(user))
})
</script>

<style lang="less" scoped>
.BasicForm {
  width: 550px;
  margin: 0 auto;
  overflow: hidden;
  padding-top: 20px;
}
</style>
