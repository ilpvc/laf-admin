<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="用户反馈数据">
        用户在使用过程中遇到的问题
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
    ></BasicTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, reactive, onBeforeMount, h } from "vue";
import { useMessage } from "naive-ui";
import { useGlobSetting } from "@/hooks/setting";
import { pageMessageCondition } from "@/api/message/message";
import { BasicTable, TableAction } from "@/components/Table";
import { getAllUser } from "@/api/user/user";
import { useAllUserStore } from "@/store/modules/allUser";
import moment from "moment/moment";
import router from "@/router";

const globSetting = useGlobSetting();

const columns = [
  {
    title: "ID",
    key: "id"
  },
  {
    title: "用户",
    key: "userId",
    render(row) {
      return h(
        "i",
        {},
        userStore.getAllUserMap.get(row.userId)
      );
    }
  },
  {
    title: "反馈内容",
    key: "content"
  },
  {
    title: "反馈时间",
    key: "createdTime",
    render(row) {
      return h(
        "i",
        {},
        moment(row.updatedTime).format("YYYY-MM-DD HH:mm:ss")
      );
    }
  }
];

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
  let newVar1 = await pageMessageCondition({ type: 3 }, resp.page, resp.pageSize);
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
          label: "详情",
          onClick: toFeedbackDetails.bind(null, record),
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


function toFeedbackDetails(record){
  console.log(record);
  router.push({
    name:'form-step-form'
  })
}

</script>
