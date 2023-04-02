import {ref} from "vue";

const comActionComponent = () => {
// 对话框相关
  const comActionDialog = ref({
    title: '操作',
    visible: false,
    buttonTitle: '删除',
    message: '是否确认删除本条内容?'
  })
  // 操作数据条件
  const comActionCondition = ref({})
  // 对话框相关接口
  const comFnName = ref()

  const refreshList = () => {
   // comActionDialog.visible.value = false
   // getItemList()
  }

  return {
    comActionDialog,comActionCondition,refreshList,comFnName
  }

}



export default comActionComponent
