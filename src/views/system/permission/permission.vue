<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="权限管理">
        可以新增权限，删除权限，修改权限信息
      </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <n-button type="primary" @click="addTable">
            <template #icon>
              <n-icon>
                <PlusOutlined/>
              </n-icon>
            </template>
            新增权限
          </n-button>
        </template>

        <template #action>
          <TableAction/>
        </template>
      </BasicTable>
    </n-card>


    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="新建">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="权限名称" path="name">
          <n-input placeholder="请输入权限名称" v-model:value="formParams.name"/>
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input type="textarea" placeholder="权限描述" v-model:value="formParams.description"/>
        </n-form-item>

      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>


    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, unref, h, onMounted} from "vue";
import {FormRules, useMessage, useDialog} from "naive-ui";
import {BasicTable, TableAction} from "@/components/Table";
import {columns} from "./columns";
import {PlusOutlined} from "@vicons/antd";
import {getTreeAll} from "@/utils";
import {useRouter} from "vue-router";
import {useAllUserStore} from "@/store/modules/allUser";

import {
  addPermissions,
  deletePermissions,
  pagePermission,
  updatePermissions
} from "@/api/permission/permission";

const router = useRouter();
const formRef: any = ref(null);
const message = useMessage();
const actionRef = ref();
const dialog = useDialog()
const showModal = ref(false);
const formBtnLoading = ref(false);
const checkedAll = ref(false);
const editRoleTitle = ref("");
const treeData = ref([]);
const expandedKeys = ref([]);
const checkedKeys = ref(["console", "step-form"]);

const params = reactive({
  pageSize: 5,
  name: "xiaoMa"
});

let formParams = ref({
  id: undefined,
  name: '',
  description: "",
});


const rules: FormRules = {
  name: {
    type: 'string',
    required: true,
    trigger: ["blur"],
    message: "请输入角色名称"
  },

  description: {
    required: false,
    trigger: ["blur", "change"],
    message: ""
  }
};
const actionColumn = reactive({
  width: 250,
  title: "操作",
  key: "action",
  fixed: "right",
  render(record) {
    return h(TableAction, {
      style: "button",
      actions: [
        {
          label: "菜单权限",
          onClick: handleMenuAuth.bind(null, record),
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
        },
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
      ]
    });
  }
});


const allUserStore = useAllUserStore();
const loadDataTable = async (res: any) => {
  let newVar = await pagePermission(res.page, res.pageSize);

  let list = newVar.data.data.list;
  // let resp = await getAllUser();
  // allUserStore.setAllUser(resp.data.data.list);
  return {pageSize: list.size, page: list.page, pageCount: list.total, list: list.records};
};

function onCheckedRow(rowKeys: any[]) {
  console.log(rowKeys);
}


function addTable() {
  showModal.value = true;
}

function reloadTable() {
  actionRef.value.reload();
}

function confirmForm(e: any) {
  e.preventDefault();
  formBtnLoading.value = true;
  formRef.value.validate(async (errors) => {
    if (!errors) {
      if (unref(updateOrSave)) {
        await addPermissions({
          name: unref(formParams).name,
          description: unref(formParams).description,
        })
        message.success("新建成功");
      } else {
        await updatePermissions({
          id: unref(formParams).id,
          name: unref(formParams).name,
          description: unref(formParams).description
        })
        message.success("更新成功");
      }
      setTimeout(() => {
        showModal.value = false;
        reloadTable();
      });
      updateOrSave.value = true
    } else {
      message.error("请填写完整信息");
    }
    formBtnLoading.value = false;
  });
}

const updateOrSave = ref(true)

function handleEdit(record: Recordable) {
  formParams.value = {
    id: record.id,
    description: record.description,
    name: record.name
  }
  addTable()
  updateOrSave.value = false
}

async function handleDelete(record: Recordable) {
  dialog.warning({
    title:'警告',
    content:'确认删除?',
    positiveText:'确认',
    negativeText:'取消',
    onPositiveClick:async ()=>{
      await deletePermissions(record.id);
      message.info("删除成功");
      reloadTable()
    },
    onNegativeClick:()=>{
      message.info("删除失败");
    }
  })

}

function handleMenuAuth(record: Recordable) {
  editRoleTitle.value = `分配 ${record.name} 的菜单权限`;
  checkedKeys.value = record.menu_keys;
  showModal.value = true;
}

function checkedTree(keys) {
  checkedKeys.value = [checkedKeys.value, ...keys];
}

function onExpandedKeys(keys) {
  expandedKeys.value = keys;
}

function packHandle() {
  if (expandedKeys.value.length) {
    expandedKeys.value = [];
  } else {
    expandedKeys.value = treeData.value.map((item: any) => item.key) as [];
  }
}

function checkedAllHandle() {
  if (!checkedAll.value) {
    checkedKeys.value = getTreeAll(treeData.value);
    checkedAll.value = true;
  } else {
    checkedKeys.value = [];
    checkedAll.value = false;
  }
}

onMounted(async () => {
  // const treeMenuList = await getMenuList();
  // expandedKeys.value = treeMenuList.list.map((item) => item.key);
  // treeData.value = treeMenuList.list;
});
</script>

<style lang="less" scoped></style>
