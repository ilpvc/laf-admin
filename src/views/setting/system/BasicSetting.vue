<template>
  <n-grid cols="2 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen">
    <n-grid-item>
      <n-form :label-width="80" :model="formValue" :rules="rules" ref="formRef">
        <n-form-item label="学习区域公告" path="textValue">
          <n-input v-model:value="formValue.textValue" placeholder="请输入网站学习公告" />
        </n-form-item>

        <!--        <n-form-item label="备案编号" path="icpCode">-->
        <!--          <n-input placeholder="请输入备案编号" v-model:value="formValue.icpCode" />-->
        <!--        </n-form-item>-->

        <!--        <n-form-item label="联系电话" path="mobile">-->
        <!--          <n-input placeholder="请输入联系电话" v-model:value="formValue.mobile" />-->
        <!--        </n-form-item>-->

        <!--        <n-form-item label="联系地址" path="address">-->
        <!--          <n-input v-model:value="formValue.address" type="textarea" placeholder="请输入联系地址" />-->
        <!--        </n-form-item>-->

        <!--        <n-form-item label="登录验证码" path="loginCode">-->
        <!--          <n-radio-group v-model:value="formValue.loginCode" name="loginCode">-->
        <!--            <n-space>-->
        <!--              <n-radio :value="1">开启</n-radio>-->
        <!--              <n-radio :value="0">关闭</n-radio>-->
        <!--            </n-space>-->
        <!--          </n-radio-group>-->
        <!--        </n-form-item>-->

        <!--        <n-form-item label="网站开启访问" path="systemOpen">-->
        <!--          <n-switch-->
        <!--            size="large"-->
        <!--            v-model:value="formValue.systemOpen"-->
        <!--            @update:value="systemOpenChange"-->
        <!--          />-->
        <!--        </n-form-item>-->

        <!--        <n-form-item label="网站关闭提示" path="closeText">-->
        <!--          <n-input-->
        <!--            v-model:value="formValue.closeText"-->
        <!--            type="textarea"-->
        <!--            placeholder="请输入网站关闭提示"-->
        <!--          />-->
        <!--        </n-form-item>-->

        <div>
          <n-space>
            <n-button type="primary" @click="formSubmit">更新基本信息</n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { useDialog, useMessage } from "naive-ui";
import { getOnlyKey, updateAttrByKey } from "@/api/attribute/attribute";

const rules = {
  textValue: {
    required: true,
    message: "请输入网站名称",
    trigger: "blur"
  }
};

const formRef: any = ref(null);
const message = useMessage();
const dialog = useDialog();

const formValue = reactive({
  id:0,
  textValue: ""
});


function formSubmit() {
  formRef.value.validate(async (errors) => {
    if (!errors) {

      await updateAttrByKey({id:formValue.id,attrKey:'announcement',textValue:formValue.textValue})
      message.success("更新成功");
    } else {
      message.error("验证失败，请填写完整信息");
    }
  });
}

async function getAnnouncement() {
  let attrRes = await getOnlyKey('announcement');
  formValue.textValue = formValue.textValue.concat(attrRes.data.data.item.textValue)
  formValue.id = attrRes.data.data.item.id
}

function resetForm() {
  formRef.value.restoreValidation();
}

onBeforeMount(()=>{
  getAnnouncement()
})

</script>
