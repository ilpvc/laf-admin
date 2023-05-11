<template>
  <n-dynamic-input
    v-model:value="formValue"
    preset="pair"
    key-placeholder="问题"
    value-placeholder="回答"
  />
  <n-button class="submit" type="info" @click="doSubmit">确认修改</n-button>
</template>

<script lang="ts" setup>

import {FormInst} from 'naive-ui'
import {onBeforeMount, ref, unref} from 'vue'
import {addAttribute, deleteAttrByCondition, getByKey} from "@/api/attribute/attribute";
import {Attribute} from "@/interface/ApiInterface";
import {useMessage} from 'naive-ui'


const formRef = ref<FormInst | null>(null)

const formValue = ref([
  {
    key:'',
    value:'',
  }
])

const message = useMessage();
async function doSubmit(){
  await deleteAttrByCondition({attrKey:'question'})
  for (const v of unref(formValue)){
    let attr:Attribute = {}
    attr.attrKey = 'question'
    attr.textValue = v.key+'__'+v.value
    await addAttribute(attr)

  }
  message.success('更新成功')
}

const attributes = ref<Attribute[]>([])

onBeforeMount(async ()=>{
  const byKey =await getByKey('question');
  attributes.value = byKey.data.data.list
  formValue.value = attributes.value.map(v=>({
    key:v.textValue?.split('__')[0] || '',
    value:v.textValue?.split('__')[1] || '',
  }))
})
</script>

<style lang="less" scoped>
.submit{
  margin-top: 10px;
}
</style>
