import {h} from "vue";


export const columns = [
  {
    title: "id",
    key: "id",
    width: 100
  },
  {
    title: "任务名",
    key: "taskName",
    width: 100,
  },
  {
    title: "积分",
    key: "points",
    width: 100
  },
  {
    title: "任务描述",
    key: "description",
    width: 100,
    render(row){
      return h(
        'span',
        {},
        row.description || '没有描述'
      )
    }
  },
  {
    title: "创建时间",
    key: "createdTime",
    width: 100
  },

  {
    title: "更新日期",
    key: "updatedTime",
    width: 100
  }
];
