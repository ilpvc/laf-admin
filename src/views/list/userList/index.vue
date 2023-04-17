<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
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
              <PlusOutlined />
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
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="名称" path="name">
          <n-input placeholder="请输入名称" v-model:value="formParams.name" />
        </n-form-item>
        <n-form-item label="地址" path="address">
          <n-input type="textarea" placeholder="请输入地址" v-model:value="formParams.address" />
        </n-form-item>
        <n-form-item label="日期" path="date">
          <n-date-picker type="datetime" placeholder="请选择日期" v-model:value="formParams.date" />
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
import { h, reactive, ref } from "vue";
// import { useMessage } from 'naive-ui';
import { BasicTable, TableAction } from "@/components/Table";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import { getTableList } from "@/api/table/list";
import { columns } from "./columns";
import { PlusOutlined } from "@vicons/antd";
import { useRouter } from "vue-router";
import { type FormRules } from "naive-ui";
import { pageUserCondition } from "@/api/user/user";

const rules: FormRules = {
  name: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入名称"
  },
  address: {
    required: true,
    trigger: ["blur", "input"],
    message: "请输入地址"
  },
  date: {
    type: "number",
    required: true,
    trigger: ["blur", "change"],
    message: "请选择日期"
  }
};

const schemas: FormSchema[] = [
  {
    field: "name",
    labelMessage: "支持模糊查询",
    component: "NInput",
    label: "用户名",
    componentProps: {
      placeholder: "用户名",
      onInput: (e: any) => {
        console.log(e);
      }
    },
    rules: [{ required: false, message: "请输入姓名", trigger: ["blur"] }]
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
const formParams = reactive({
  name: "",
  address: "",
  date: null
});

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
        window["$message"].info(`您点击了，${key} 按钮`);
      }
    });
  }
});

const [register, {}] = useForm({
  gridProps: { cols: "1 s:1 m:2 l:3 xl:4 2xl:4" },
  labelWidth: 80,
  schemas
});

function addTable() {
  showModal.value = true;
}

const loadDataTable = async (res) => {
  let newVar1 = await pageUserCondition({}, { pageNo: res.page, pageCount: res.pageSize });
  const items = newVar1.data.data.items
  console.log(res);
  console.log(items);
  return { list: items.records, pageNo: res.page, pageSize: res.pageSize ,pageCount: items.pages };
};

// const loadDataTable =async ()=>{
//
// }

function onCheckedRow(rowKeys) {
  console.log(rowKeys);
}

function reloadTable() {
  actionRef.value.reload();
}

function confirmForm(e) {
  e.preventDefault();
  formBtnLoading.value = true;
  formRef.value.validate((errors) => {
    if (!errors) {
      window["$message"].success("新建成功");
      setTimeout(() => {
        showModal.value = false;
        reloadTable();
      });
    } else {
      window["$message"].error("请填写完整信息");
    }
    formBtnLoading.value = false;
  });
}

function handleEdit(record: Recordable) {
  console.log("点击了编辑", record);
  router.push({ name: "basic-info", params: { id: record.id } });
}

function handleDelete(record: Recordable) {
  console.log("点击了删除", record);
  window["$message"].info("点击了删除");
}

function handleSubmit(values: Recordable) {
  console.log(values);
  reloadTable();
}

function handleReset(values: Recordable) {
  console.log(values);
}
</script>

<style lang="less" scoped></style>