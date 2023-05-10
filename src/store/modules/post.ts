import {defineStore} from "pinia";
import {Post} from "@/interface/ApiInterface";

export const usePostStore = defineStore('postStore',()=>{
  let currentPost:Post = {count:0}
  function setCurrentPost(s:Post){
    currentPost = s
  }

  function getCurrentPost(){
    return currentPost
  }

  return {
    setCurrentPost,
    getCurrentPost
  }


})
