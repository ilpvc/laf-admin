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
        <n-form-item label="类型" path="typeValue">
          <n-select v-model:value="post.type"
                    :options="[1,2,3].map((v)=>({
                    label: ()=>{
                      if(v===1)return '失物'
                      if(v===2) return '招领'
                      if(v===3) return '其他'
                      },
                    value: v
                    }))"
          />
        </n-form-item>
        <n-form-item :label="post.type===3? '帖子标题':'物品信息'" path="titleValue">
          <n-input v-model:value="post.title" :placeholder="post.type===3? '帖子标题':'物品信息'" />
        </n-form-item>
        <n-form-item label="具体描述" path="contentValue">
          <n-input
            v-model:value="post.content"
            placeholder="具体描述"
            type="textarea"
            :autosize="{
          minRows: 3,
          maxRows: 5
        }"
          />
        </n-form-item>

        <n-form-item label="图片上传">
          <n-upload
            ref="upload"
            action="http://localhost:8080/lostandfound/upload/image"
            list-type="image-card"
            :accept="'/image/*'"
            :file-list="fileList"
            :default-upload="false"
            multiple
            :custom-request="customRequest"
          />
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
import {addPost, deletePost, pagePostCondition, updatePost} from "@/api/post/post";
import { useAllUserStore } from "@/store/modules/allUser";
import {Post, PostQuery} from "@/interface/ApiInterface";
import { service } from "@/utils/http/axios/Axios";
import { debounce } from "lodash";
import { storage } from "@/utils/Storage";
import { deleteTasks } from "@/api/task/task";
import {array} from "vue-types";

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
    field: "title",
    component: "NInput",
    label: "标题",
    componentProps: {
      placeholder: "请输入标题",
    },
    rules: [{ required: false, message: "请输入姓名", trigger: ["blur"] }]
  },
  {
    field: "status",
    component: "NSelect",
    label: "状态",
    componentProps: {
      placeholder: "帖子状态",
      showButton: false,
      options: [
        {
          label: "正常",
          value: 1
        },
        {
          label: "待审核",
          value: 2
        },
        {
          label: "已删除",
          value: 3
        },
        {
          label: "已禁用",
          value: 4
        },
        {
          label: "已完结",
          value: 5
        }
      ],
      onInput: (e: any) => {
        console.log(e);
      }
    }
  },
  {
    field: "type",
    component: "NSelect",
    label: "类型",
    componentProps: {
      placeholder: "帖子类型",
      options: [
        {
          label: "失物贴",
          value: 1
        },
        {
          label: "招领贴",
          value: 2
        },
        {
          label: "其他贴",
          value: 3
        }
      ],
      onUpdateValue: (e: any) => {
        console.log(e);
      }
    }
  }

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

// const params = ref({
//   pageSize: 5,
//   name: 'xiaoMa',
// });

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
        // {
        //   label: "编辑",
        //   onClick: handleEdit.bind(null, record),
        //   ifShow: () => {
        //     return true;
        //   },
        //   auth: ["basic_list"]
        // }
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
        if (key==='enabled'){
          let post:Post = unref(record)
          post.status=1
          updatePost(post)
          window["$message"].success('启用成功')
        }else{
          let post:Post = unref(record)
          post.status=2
          updatePost(post)
          window["$message"].success('禁用成功')
        }
        // window["$message"].info(`您点击了，${key} 按钮`);
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
  let newVar1 = await pagePostCondition({
    title:unref(postQuery).title,
    status:unref(postQuery).status||[1,2,3,4,5],
    types:postQuery.value.types
    },
    resp.page,
    resp.pageSize);
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

function confirmForm(e) {
  e.preventDefault();
  formBtnLoading.value = true;
  formRef.value.validate(async (errors) => {
    if (!errors) {
      await doSubmit();
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
  dialog.warning({
    title: "警告",
    content: "确认删除",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      await deletePost(record.id);
      reloadTable();
      window["$message"].success("删除成功");
    },
    onNegativeClick: () => {
      window["$message"].error("删除失败");
    }
  });

}

const postQuery =ref<PostQuery>({})
function handleSubmit(values: Recordable) {
  let status = [values.status]
  let types = [values.type]
  postQuery.value = {...unref(values),status:status,types:types}
  console.log(postQuery.value)
  reloadTable();
}

function handleReset(values: Recordable) {
  console.log(values);
}

const upload = ref<UploadInst | null>(null);
const fileList = ref<UploadFileInfo[]>();
let post = ref<Post>({
  title: "",
  type: 1,
  count: 0,
  status: 1,
  backUserId: undefined,
  image: "",
  content: "",
  userId: storage.get("CURRENT-USER").id

});


async function doSubmit() {
  console.log(upload.value);
  await upload.value?.submit();
  doAddPost();

  window["$message"].success("提交成功");
}

const doAddPost = debounce(() => {

  post.value.image = images.toString().replace(/,/g, " ");
  addPost(post.value).then(res => {
    window["$message"].success("发送成功");
  });
}, 800);

let images: string[] = [];
//自定义图片上传请求
const customRequest = ({
                         file,
                         data,
                         headers,
                         withCredentials,
                         action,
                         onFinish,
                         onError,
                         onProgress
                       }: UploadCustomRequestOptions) => {
  const formData = new FormData();
  images = [];
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(
        key,
        data[key as keyof UploadCustomRequestOptions["data"]]
      );
    });
  }
  formData.append("file", file.file as File);
  service({
    url: action as string,
    method: "post",
    data: formData
  }).then((res) => {
    images.push(res.data);
    console.log(images);
  }, reject => {
    console.log(reject);
  });
};
</script>

<style lang="less" scoped></style>
