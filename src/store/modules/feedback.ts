import {defineStore} from "pinia";
import {Message} from "@/interface/ApiInterface";

export const useFeedbackStore = defineStore('feedbackStore',()=>{
  let currentFeedbackMessage:Message = {}

  function setCurrentFeedbackMessage(c:Message){
    currentFeedbackMessage = c
  }

  function getCurrentFeedBackMessage(){
    return currentFeedbackMessage
  }

  return {
    setCurrentFeedbackMessage,
    getCurrentFeedBackMessage
  }
})
