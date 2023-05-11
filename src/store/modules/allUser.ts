import { User } from "@/interface/ApiInterface";
import { defineStore } from "pinia";
import { store } from "@/store";

interface allUserInfo {
  allUser: User[];
  currentUser:User;
}

export const useAllUserStore = defineStore({
  id: "all-user",
  state: (): allUserInfo => ({
    allUser: [],
    currentUser:{}
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

    getAllUserIdAndUserName():User[]{
     return this.allUser.map(({ id,nickname }) =>({ id:id,nickname:nickname}));
    },

    getUserName():User[]{
      return this.allUser
    },

    getCurrentUser():User{
      return this.currentUser
    }
  },

  actions: {
    setAllUser(u:User[]){
      this.allUser = u
    },
    setCurrentUser(u:User){
      this.currentUser = u
    }
  }
});


export function useAllUserStoreWidthOut() {
  return useAllUserStore(store);
}
