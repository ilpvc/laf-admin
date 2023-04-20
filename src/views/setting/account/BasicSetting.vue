<template>
  <n-grid cols="2 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen">
    <n-grid-item>
      <n-form :label-width="80" :model="formValue" :rules="rules" ref="formRef">

        <n-form-item label="姓名" path="realName">
          <n-input v-model:value="formValue.realName" placeholder="真实姓名"/>
        </n-form-item>
        <n-form-item label="性别" path="gender">
          <n-select
            v-model:value="formValue.gender"
            placeholder="选择性别"
            :options="[1,2].map((v)=>({
                  label: ()=>{if(v===1)return '男';else return '女'},
                  value: v
                  }))"
          />
        </n-form-item>
        <n-form-item label="年龄" path="age">
          <n-input-number v-model:value="formValue.age" placeholder="年龄"/>
        </n-form-item>
        <n-form-item label="班级" path="clazz">
          <n-input v-model:value="formValue.clazz" placeholder="班级"/>
        </n-form-item>
        <n-form-item label="QQ" path="qq">
          <n-input v-model:value="formValue.qq" placeholder="QQ"/>
        </n-form-item>

        <n-form-item label="邮箱" path="email">
          <n-input placeholder="请输入邮箱" v-model:value="formValue.email"/>
        </n-form-item>

        <div>
          <n-space>
            <n-button type="primary" @click="formSubmit">更新基本信息</n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import {reactive, ref, unref} from 'vue';
import {useMessage} from 'naive-ui';
import {storage} from "@/utils/Storage";
import {updateUser} from "@/api/user/user";
import {User} from "@/interface/ApiInterface";

const rules = {
  name: {
    required: true,
    message: '请输入昵称',
    trigger: 'blur',
  },
  email: {
    required: false,
    message: '请输入邮箱',
    validator(rule ,value){
      const pattern = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
      return pattern.test(value);
    }
  },
  mobile: {
    required: true,
    message: '请输入联系电话',
    trigger: 'input',
  },
  age: {
    required: false,
    message: '请输入正确的年龄',
    validator: (rule, value: number)=> {
      return !(value < 0 || value > 120);
    }
  }
};
const formRef: any = ref(null);
const message = useMessage();

const formValue = reactive({
  realName: storage.get('CURRENT-USER').realName,
  age: storage.get('CURRENT-USER').age,
  gender: storage.get('CURRENT-USER').gender,
  clazz: storage.get('CURRENT-USER').clazz,
  qq: storage.get('CURRENT-USER').qq,
  email: storage.get('CURRENT-USER').email,
});

function formSubmit() {
  formRef.value.validate(async (errors) => {
    if (!errors) {
      const user:User = {...unref(formRef)}
      await updateUser({id:storage.get("CURRENT-USER"),...user})
      message.success('验证成功');
    } else {
      message.error('验证失败，请填写完整信息');
    }
  });
}
</script>
