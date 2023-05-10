<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="用户发帖审核">
        对用户发起的帖子进行审核
      </n-card>
    </div>

    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1090"
    >

    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, reactive, h } from "vue";
import {NTag, useMessage} from "naive-ui";
import { BasicTable, TableAction } from "@/components/Table";
import { getAllUser } from "@/api/user/user";
import { useAllUserStore } from "@/store/modules/allUser";
import router from "@/router";
import {getPostById, pagePostCondition} from "@/api/post/post";
import {columns} from "@/views/form/postForm/stepForm/columns";
import {usePostStore} from "@/store/modules/post";


const formRef: any = ref(null);
const message = useMessage();
const dataTable = ref();
const data = ref();
function reloadTable() {
  dataTable.value.reload();
}

let userStore = useAllUserStore();
const loadDataTable = async (resp) => {
  console.log(resp);
  let newVar1 = await pagePostCondition({ status:[2]}, resp.page, resp.pageSize);
  const list = newVar1.data.data.items;
  let res = await getAllUser();
  userStore.setAllUser(res.data.data.list);
  return { list: list.records, pageNo: resp.page, pageSize: resp.pageSize, pageCount: list.pages };
};

function onCheckedRow(rowKeys) {
  console.log(rowKeys);
}

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
          label: "审核",
          onClick: toPostDetails.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => {
            return true;
          },
          // 根据权限控制是否显示: 有权限，会显示，支持多个
          auth: ["basic_list"]
        }
      ],
      disabled: unref(record).status===1,
      select: (key) => {
        window["$message"].info(`您点击了，${key} 按钮`);
      }
    });
  }
});

const postStore = usePostStore();
function toPostDetails(record){
  console.log(record);
  postStore.setCurrentPost(unref(record))
  router.push({
    name:'post-step-form',
    params:{id:record.id}
  })
}

</script>
