import {FormSchema} from "@/components/Form";
import {useAllUserStore} from "@/store/modules/allUser";
const userStore = useAllUserStore();
const user = userStore.getCurrentUser
export const schemas: FormSchema[] = [
  {
    field: 'nickname',
    component: 'NInput',
    label: '昵称',
    defaultValue:user.nickname,
    // labelMessage: '这是一个提示',
    giProps: {
      span: 1,
    },
    componentProps: {
      placeholder: '请输入姓名',
      onInput: (e: any) => {
        console.log(e);
      },
    },
    rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
  },
  {
    field: 'realName',
    component: 'NInput',
    label: '真实姓名',
    defaultValue:user.realName,
    componentProps: {
      placeholder: '请输入真实姓名',
      showButton: false,
      // onInput: (e: any) => {
      //   console.log(e);
      // },
    },
  },

  {
    field: 'age',
    component: 'NInputNumber',
    label: '年龄',
    defaultValue:user.age,
    giProps: {
      //span: 24,
    },
    componentProps: {
      type: 'date',
      clearable: true,
      onUpdateValue: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'clazz',
    component: 'NInput',
    defaultValue:user.clazz,
    label: '班级',
    giProps: {
      //span: 24,
    },
    componentProps: {
      clearable: true,
      onUpdateValue: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'phone',
    component: 'NInput',
    defaultValue:user.phoneNumber,
    label: '电话号码',
    giProps: {
      //span: 24,
    },
    componentProps: {
      clearable: true,
      onUpdateChecked: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'gender',
    component: 'NRadioGroup',
    defaultValue:user.gender,
    label: '性别',
    giProps: {
      //span: 24,
    },
    componentProps: {
      options: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
      ],
      onUpdateChecked: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'integral',
    component: 'NInputNumber',
    defaultValue:user.integral,
    label: '积分',
    giProps: {
      //span: 24,
    },
    componentProps: {
      clearable: true,
      onUpdateChecked: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'qq',
    component: 'NInputNumber',
    defaultValue:user.qq,
    label: 'QQ',
    giProps: {
      //span: 24,
    },
    componentProps: {
      clearable: true,
      onUpdateChecked: (e: any) => {
        console.log(e);
      },
    },
  },

];
