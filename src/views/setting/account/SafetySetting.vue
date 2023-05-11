<template>
  <n-grid cols="1" responsive="screen" class="-mt-5">
    <n-grid-item>
      <n-list>
        <n-list-item>
          <template #suffix>
            <n-button type="primary" text @click="doShowModal">修改</n-button>
          </template>
          <n-thing title="账户密码">
            <template #description
            ><span class="text-gray-400">绑定手机和邮箱，并设置密码，帐号更安全</span></template
            >
          </n-thing>
        </n-list-item>
        <!--        <n-list-item>-->
        <!--          <template #suffix>-->
        <!--            <n-button type="primary" text>修改</n-button>-->
        <!--          </template>-->
        <!--          <n-thing title="绑定手机">-->
        <!--            <template #description-->
        <!--              ><span class="text-gray-400">已绑定手机号：+86189****4877</span></template-->
        <!--            >-->
        <!--          </n-thing>-->
        <!--        </n-list-item>-->
        <!--        <n-list-item>-->
        <!--          <template #suffix>-->
        <!--            <n-button type="primary" text>设置</n-button>-->
        <!--          </template>-->
        <!--          <n-thing title="密保问题">-->
        <!--            <template #description-->
        <!--              ><span class="text-gray-400"-->
        <!--                >未设置密保问题，密保问题可有效保护账户安全</span-->
        <!--              ></template-->
        <!--            >-->
        <!--          </n-thing>-->
        <!--        </n-list-item>-->
        <!--        <n-list-item>-->
        <!--          <template #suffix>-->
        <!--            <n-button type="primary" text>修改</n-button>-->
        <!--          </template>-->
        <!--          <n-thing title="个性域名">-->
        <!--            <template #description-->
        <!--              ><span class="text-gray-400">已绑定域名：https://www.naiveui.com</span></template-->
        <!--            >-->
        <!--          </n-thing>-->
        <!--        </n-list-item>-->
      </n-list>
    </n-grid-item>

  </n-grid>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    title="确认"
    content="你确认?"
    positive-text="确认"
    negative-text="取消"
    @positive-click="confirmModification"
    :closable="false"
  >
    <n-form ref="formRef">
      <n-form-item path="password" label="原密码">
        <n-input
          v-model:value="user.originPassword"
          type="password"
          placeholder="原密码"
        />
      </n-form-item>
      <n-form-item path="password" label="新密码">
        <n-input
          v-model:value="user.password"
          type="password"
          placeholder="新密码"
        />
      </n-form-item>
      <n-form-item
        ref="rPasswordFormItemRef"
        first
        path="reenteredPassword"
        label="重复密码"
      >
        <n-input
          v-model:value="user.rePassword"
          :disabled="!user.password"
          type="password"
          placeholder="重复密码"
        />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script lang="ts" setup>

import {ref} from "vue";
import {getUserById, updateUserSecurity} from "@/api/user/user";
import {storage} from "@/utils/Storage";
import router from "@/router";
import {useMessage} from 'naive-ui'

const message = useMessage()
const showModal = ref(false)

function doShowModal(){
  showModal.value = true
}

const user = ref({
  userId: storage.get('CURRENT-USER').id,
  rePassword: "",
  originPassword: "",
  password: ""
})
async function confirmModification() {
  await updateUserSecurity(user.value).then(res => {
    if (res.data.code===200){
      message.success(res.data.message)
      router.push({
        name:'Login'
      })
    }else {
      message.error(res.data.message)
    }
  })


}
</script>
