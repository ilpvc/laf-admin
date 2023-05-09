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
<!--        <n-form-item label="类型" path="typeValue">-->
<!--          <n-select v-model:value=""-->
<!--                    :options="[1,2,3].map((v)=>({-->
<!--                    label: ()=>{-->
<!--                      if(v===1)return '失物'-->
<!--                      if(v===2) return '招领'-->
<!--                      if(v===3) return '其他'-->
<!--                      },-->
<!--                    value: v-->
<!--                    }))"-->
<!--          />-->
<!--        </n-form-item>-->
<!--        <n-form-item :label="3===3? '帖子标题':'物品信息'" path="titleValue">-->
<!--          <n-input v-model:value="'c'" :placeholder="1? '帖子标题':'物品信息'"/>-->
<!--        </n-form-item>-->
<!--        <n-form-item label="具体描述" path="contentValue">-->
<!--          <n-input-->
<!--            v-model:value="'陈'"-->
<!--            placeholder="具体描述"-->
<!--            type="textarea"-->
<!--            :autosize="{-->
<!--          minRows: 3,-->
<!--          maxRows: 5-->
<!--        }"-->
<!--          />-->
<!--        </n-form-item>-->


      </n-form>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
import {h, reactive, ref, unref} from "vue";
// import { useMessage } from 'naive-ui';
import {BasicTable, TableAction} from "@/components/Table";
import {BasicForm, FormSchema, useForm} from "@/components/Form/index";
import {getTableList} from "@/api/table/list";
import {columns} from "./columns";
import {PlusOutlined} from "@vicons/antd";
import {useRouter} from "vue-router";
import {
  type FormRules,
  UploadFileInfo,
  UploadCustomRequestOptions,
  UploadInst,
  useDialog
} from "naive-ui";
import {getAllUser, pageUserCondition} from "@/api/user/user";
import {addPost, deletePost, pagePost, pagePostCondition} from "@/api/post/post";
import {useAllUserStore} from "@/store/modules/allUser";
import {Post} from "@/interface/ApiInterface";
import {service} from "@/utils/http/axios/Axios";
import {debounce} from "lodash";
import {storage} from "@/utils/Storage";
import {deleteTasks} from "@/api/task/task";
import {deleteComments, pageCommentsCondition, pageConfigComment} from "@/api/comment/comment";
import {pageMessageCondition, pageMessageConfig} from "@/api/message/message";


const schemas: FormSchema[] = [
  {
    field: "title",
    component: "NInput",
    label: "消息",
    componentProps: {
      placeholder: "消息",
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
  gridProps: {cols: "1 s:1 m:2 l:3 xl:4 2xl:4"},
  labelWidth: 80,
  schemas
});

function addTable() {
  showModal.value = true;
}

const allUserStore = useAllUserStore();
const loadDataTable = async (resp) => {
  console.log(resp)
  let newVar1 = await pageMessageCondition({content: searchValue.value}, resp.page, resp.pageSize);
  let list = newVar1.data.data.items;
  list = list.records.filter(v => v.type !== 3)
  let res = await getAllUser();
  allUserStore.setAllUser(res.data.data.list);
  return {list: list, pageNo: resp.page, pageSize: resp.pageSize, pageCount: list.pages};
};


function onCheckedRow(rowKeys) {
  console.log(rowKeys);
}

function reloadTable() {
  actionRef.value.reload();
}


function handleEdit(record: Recordable) {
  console.log("点击了编辑", record);
  router.push({name: "basic-info", params: {id: record.id}});
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
