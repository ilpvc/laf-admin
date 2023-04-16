import { User } from "@/interface/ApiInterface";
import { defineStore } from "pinia";
import { store } from "@/store";

interface allUserInfo {
  allUser: User[];
}

export const useAllUserStore = defineStore({
  id: "all-user",
  state: (): allUserInfo => ({
    allUser: []
  }),

  getters: {
    getAllUserMap():Map<number,string> {
      let userMapper = this.allUser.map(({ id,nickname }) =>({ id:id,nickname:nickname}));
      let map = new Map()
      for (let item of userMapper){
        map.set(item.id,item.nickname)
      }
      return map
    },
    getUserName():User[]{
      return this.allUser
    }
  },

  actions: {
    setAllUser(u:User[]){
      this.allUser = u
    }
  }
});


export function useAllUserStoreWidthOut() {
  return useAllUserStore(store);
}
