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
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="任务名称" path="taskName">
          <n-input placeholder="请输入任务名称" v-model:value="formParams.taskName"/>
        </n-form-item>
        <n-form-item label="积分" path="points">
          <n-input-number placeholder="任务积分" v-model:value="formParams.points"/>
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input type="textarea" placeholder="任务描述" v-model:value="formParams.description"/>
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
import {type FormRules, useDialog} from "naive-ui";
import {addTasks, deleteTasks, pageTask, updateTasks} from "@/api/task/task";

const rules: FormRules = {
  taskName: {
    type: 'string',
    required: true,
    trigger: ["blur"],
    message: "请输入任务名称"
  },
  points: {
    type: "number",
    required: true,
    trigger: ["blur", "input"],
    message: "请输入积分"
  },
  description: {
    required: false,
    trigger: ["blur", "change"],
    message: ""
  }
};

const schemas: FormSchema[] = [
  {
    field: "taskName",
    labelMessage: "支持模糊查询",
    component: "NInput",
    label: "任务名",
    componentProps: {
      placeholder: "任务名",
      onInput: (e: any) => {
        console.log(e);
      }
    },
    rules: [{required: false, message: "请输入任务名", trigger: ["blur"]}]
  },

];
const dialog = useDialog();
const router = useRouter();
const formRef: any = ref(null);
// const message = useMessage();
const actionRef = ref();

const showModal = ref(false);
const formBtnLoading = ref(false);
let formParams = ref({
  taskId: 0,
  taskName: "",
  points: 0,
  description: ''
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
  let newVar1 = await pageTask(res.page, res.pageSize);
  const items = newVar1.data.data.list
  return {list: items.records, pageNo: res.page, pageSize: res.pageSize, pageCount: items.pages};
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
  formRef.value.validate(async (errors) => {
    if (!errors) {
      if (unref(updateOrSave)) {
        await addTasks({
          description: unref(formParams).description,
          points: unref(formParams).points,
          taskName: unref(formParams).taskName
        })
      } else {
        await updateTasks({...formParams.value})
      }
      window["$message"].success("新建成功");
      setTimeout(() => {
        showModal.value = false;
        reloadTable();
      });
    } else {
      window["$message"].error("请填写完整信息");
    }
    updateOrSave.value=true
    formBtnLoading.value = false;
  });
}

//更新还是新增.默认为新增
const updateOrSave = ref(true)

function handleEdit(record: Recordable) {
  formParams.value = {
    taskId: record.taskId,
    description: record.description,
    points: record.points,
    taskName: record.taskName
  }
  addTable()
  updateOrSave.value = false
  // router.push({name: "basic-info", params: {id: record.id}});
}

function handleDelete(record: Recordable) {
  dialog.warning({
    title: '警告',
    content: '确认删除',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      await deleteTasks(record.taskId);
      reloadTable()
      window["$message"].success("删除成功");
    },
    onNegativeClick: () => {
      window["$message"].error("删除失败");
    }
  })

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
