import {defineStore} from "pinia";
import {Report} from "@/interface/ApiInterface";

export const useReportStore = defineStore('reportStore', () => {
  let currentReport: Report = {}

  function setCurrentReport(s: Report) {
    currentReport = s
  }
  function getCurrentReport(){
    return currentReport
  }

  return {
    setCurrentReport,
    getCurrentReport
  }
})
