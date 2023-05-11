<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]"/>
      </template>
    </BasicForm>

    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1090"
    >
      <template #tableTitle>
        <n-button type="primary" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined/>
            </n-icon>
          </template>
          新建
        </n-button>
      </template>

      <template #toolbar>
        <n-button type="primary" @click="reloadTable">刷新数据</n-button>
      </template>
    </BasicTable>

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建">
      <n-form
        :model="formParams"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="用户名" path="nickname">
          <n-input placeholder="输入用户名" v-model:value="formParams.nickName"/>
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input placeholder="请输入邮箱" v-model:value="formParams.email"/>
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input type="password" placeholder="输入密码" v-model:value="formParams.password"/>
        </n-form-item>
        <n-form-item label="邮箱验证码" path="code">
          <n-input placeholder="验证码" v-model:value="formParams.code"/>
          <n-button @click='sendCode'>发送</n-button>
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>


    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
import {h, reactive, ref, unref} from "vue";
// import { useMessage } from 'naive-ui';
import {BasicTable, TableAction} from "@/components/Table";
import {BasicForm, FormSchema, useForm} from "@/components/Form/index";
import {columns} from "./columns";
import {PlusOutlined} from "@vicons/antd";
import {useRouter} from "vue-router";
import {type FormRules} from "naive-ui";
import {
  deleteUser,
  getEmailCode,
  getUserById,
  pageUserCondition,
  updateUser
} from "@/api/user/user";
import {LoginParams, User, UserQuery} from "@/interface/ApiInterface";
import {register as doRegister} from "@/api/user/user";
import {useAllUserStore} from "@/store/modules/allUser";
import {func} from "vue-types";


const schemas: FormSchema[] = [
  {
    field: "nickname",
    labelMessage: "支持模糊查询",
    component: "NInput",
    label: "用户名",
    componentProps: {
      placeholder: "用户名",
      onInput: (e: any) => {
        console.log(e);
      }
    },
    rules: [{required: false, message: "请输入姓名", trigger: ["blur"]}]
  },
  // {
  //   field: 'mobile',
  //   component: 'NInputNumber',
  //   label: '手机',
  //   componentProps: {
  //     placeholder: '请输入手机号码',
  //     showButton: false,
  //     onInput: (e: any) => {
  //       console.log(e);
  //     },
  //   },
  // },
  {
    field: "gender",
    component: "NSelect",
    label: "性别",
    componentProps: {
      placeholder: "请选择性别",
      options: [
        {
          label: "男",
          value: 1
        },
        {
          label: "女",
          value: 2
        }
      ],
      onUpdateValue: (e: any) => {
        console.log(e);
      }
    }
  },
  {
    field: "status",
    component: "NSelect",
    label: "状态",
    //插槽
    componentProps: {
      placeholder: "请选择状态",
      options: [
        {
          label: "正常",
          value: 1
        },
        {
          label: "封禁",
          value: 2
        }
      ],
      onUpdateValue: (e: any) => {
        console.log(e);
      }
    }
  }
];

const router = useRouter();
const formRef: any = ref(null);
// const message = useMessage();
const actionRef = ref();

const showModal = ref(false);
const formBtnLoading = ref(false);
const formParams = reactive<LoginParams>({});

const params = ref({
  pageSize: 5,
  name: "xiaoMa"
});

const actionColumn = reactive({
  width: 220,
  title: "操作",
  key: "action",
  fixed: "right",
  render(record) {
    return h(TableAction as any, {
      style: "button",
      actions: [
        {
          label: "删除",
          onClick: handleDelete.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => {
            return true;
          },
          // 根据权限控制是否显示: 有权限，会显示，支持多个
          auth: ["basic_list"]
        },
        {
          label: "编辑",
          onClick: handleEdit.bind(null, record),
          ifShow: () => {
            return true;
          },
          auth: ["basic_list"]
        }
      ],
      dropDownActions: [
        {
          label: "启用",
          key: "enabled",
          // 根据业务控制是否显示: 非enable状态的不显示启用按钮
          ifShow: () => {
            return true;
          }
        },
        {
          label: "禁用",
          key: "disabled",
          ifShow: () => {
            return true;
          }
        }
      ],
      select: (key) => {
        if (key==="enabled"){
          let user:User = unref(record)
          user.status=1
          updateUser(user)
          window["$message"].success('启用成功')
        }else{
          let user:User = unref(record)
          user.status=2
          updateUser(user)
          window["$message"].success('禁用成功')
        }
      }
    });
  }
});

const [register, {}] = useForm({
  gridProps: {cols: "1 s:1 m:2 l:3 xl:4 2xl:4"},
  labelWidth: 80,
  schemas
});

function addTable() {
  showModal.value = true;
}

const loadDataTable = async (res) => {
  let newVar1 = await pageUserCondition(userQuery, res.page, res.pageSize);
  const items = newVar1.data.data.items
  console.log(res);
  console.log(items);
  return {list: items.records, pageNo: res.page, pageSize: res.pageSize, pageCount: items.pages};
};


function onCheckedRow(rowKeys) {
  console.log(rowKeys);
}

function reloadTable() {
  actionRef.value.reload();
}

async function confirmForm(e) {
  e.preventDefault();
  formBtnLoading.value = true;
  if (formParams.nickName === undefined) {
    window["$message"].error("请输入用户名")
  } else if (formParams.email === undefined) {
    window["$message"].error('请输入邮箱')
  } else if (formParams.password === undefined) {
    window["$message"].error('请输入密码')
  } else {
    doRegister(formParams).then(res => {
      if (res.code === 200) {
        window["$message"].success(res.data.message)
      } else {
        window["$message"].error(res.data.message)
      }

    })
    window["$message"].success("新建成功");
  }
  setTimeout(() => {
    showModal.value = false;
    reloadTable();
  });

  formBtnLoading.value = false;
}

const userStore = useAllUserStore();
function handleEdit(record: Recordable) {
  userStore.setCurrentUser(unref(record))
  router.push({name: "user-info", params: {id: record.id}});
}

function handleDelete(record: Recordable) {
  window['$dialog'].error({
    title:'警告',
    content:'你正在删除用户,这是一个危险操作,请确认',
    positiveText:'确认',
    negativeText:'取消',
    onPositiveClick: ()=>{
      deleteUser(unref(record).id)
      console.log('删除成功')
      reloadTable()
    }
  })
  console.log("点击了删除", record);
}

let userQuery: UserQuery = {}

function handleSubmit(values: Recordable) {
  userQuery = {...unref(values)}
  reloadTable();
}

function handleReset(values: Recordable) {
  console.log(values);
}

function handleDisable(values: Recordable) {
  console.log(values)
}

function handleEnable(values: Recordable){
  console.log(values)
}

function sendCode() {
  if (formParams.email === null) {
    window['$message'].error('请输入邮箱')
    return
  }
  getEmailCode({userEmail: formParams.email})
  window['$message'].success('发送成功')
}
</script>

<style lang="less" scoped></style>
