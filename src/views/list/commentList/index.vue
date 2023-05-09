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

      <template #toolbar>
        <n-button type="primary" @click="reloadTable">刷新数据</n-button>
      </template>
    </BasicTable>

  </n-card>
</template>

<script lang="ts" setup>
import {h, reactive, ref, unref} from "vue";
// import { useMessage } from 'naive-ui';
import { BasicTable, TableAction } from "@/components/Table";
import { BasicForm, FormSchema, useForm } from "@/components/Form/index";
import { getTableList } from "@/api/table/list";
import { columns } from "./columns";
import { PlusOutlined } from "@vicons/antd";
import { useRouter } from "vue-router";
import {
  type FormRules,
  UploadFileInfo,
  UploadCustomRequestOptions,
  UploadInst,
  useDialog
} from "naive-ui";
import { getAllUser, pageUserCondition } from "@/api/user/user";
import { addPost, deletePost, pagePost, pagePostCondition } from "@/api/post/post";
import { useAllUserStore } from "@/store/modules/allUser";
import { Post } from "@/interface/ApiInterface";
import { service } from "@/utils/http/axios/Axios";
import { debounce } from "lodash";
import { storage } from "@/utils/Storage";
import { deleteTasks } from "@/api/task/task";
import {deleteComments, pageCommentsCondition, pageConfigComment} from "@/api/comment/comment";


const schemas: FormSchema[] = [
  {
    field: "title",
    component: "NInput",
    label: "标题",
    componentProps: {
      placeholder: "请输入评论内容",
      onInput: (e: any) => {
        console.log(e);
      }
    },
  },

];

const dialog = useDialog();
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

const allUserStore = useAllUserStore();
const loadDataTable = async (resp) => {
  console.log(resp)
  let newVar1 = await pageCommentsCondition({content:searchValue.value},resp.page, resp.pageSize);
  const list = newVar1.data.data.items;
  let res = await getAllUser();
  allUserStore.setAllUser(res.data.data.list);
  return { list: list.records, pageNo: resp.page, pageSize: resp.pageSize, pageCount: list.pages };
};


function onCheckedRow(rowKeys) {
  console.log(rowKeys);
}

function reloadTable() {
  actionRef.value.reload();
}


function handleEdit(record: Recordable) {
  console.log("点击了编辑", record);
  router.push({ name: "basic-info", params: { id: record.id } });
}

function handleDelete(record: Recordable) {
  dialog.warning({
    title: "警告",
    content: "确认删除",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      await deleteComments(record.id);
      reloadTable();
      window["$message"].success("删除成功");
    },
    onNegativeClick: () => {
      window["$message"].error("删除失败");
    }
  });

}

const searchValue = ref('')
async function handleSubmit(values: Recordable) {
  searchValue.value = unref(values).title
  reloadTable()
}

function handleReset(values: Recordable) {



  reloadTable()
  console.log(values.title)
}



</script>

<style lang="less" scoped></style>
