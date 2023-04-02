import {reactive, ref, toRefs} from 'vue'
import {opFormDialog, Result} from "@/mixins/opFormTypes";
import {UserForm} from "@/api/user/types";
import {ElMessage} from 'element-plus'

const opFormComponent = () => {

  // const opForm = reactive({
  //   opFormDialogVisible: false, // 操作表单框
  //   opFormDialog: {title: '操作', visible: false, buttonTitle: '添加'} as opFormDialog,
  //   // opFormModel: {}, // 表单绑定的Model
  //   opFormItems: [], // 绑定表单的元素
  //   opFnName: (params: any) => {
  //   }, // 操作数据的修改或者新增
  //   opFormBtnLoading: false,
  //   opFormRules: []
  // });
//  const {opFormDialog, opFormItems, opFnName, opFormBtnLoading, opFormRules} = toRefs(opForm)

  const opFormDialog = ref({title: '操作', visible: false, buttonTitle: '添加'})
  const opFormItems = ref([])
  const opFnName = ref()
  const opFormBtnLoading = ref(false)
  const opFormRules = ref([])


  /**
   * 关闭对话框刷新列表
   */
  const refreshList = () => {
    opFormDialog.value.visible = false
    // await this.getItemList()
  }


  /**
   * 关闭操作对话框
   */
  const opCloseForm = () => {
    opFormDialog.value.visible = false
  }

  /**
   * 提交表单
   * @param params
   */
  const onFormSubmit = async (params: any) => {
    opFormBtnLoading.value = true
    try {
      const result: any = await opFnName.value(params)
      if (result.code === 20000) {
        ElMessage({message: `操作成功`, grouping: true, type: 'success',})
      } else {
        ElMessage({message: `${result.message}`, grouping: true, type: 'error',})
      }
    } catch (e) {
      console.error(e)
    } finally {
      opFormBtnLoading.value = false
      opFormDialog.value.visible = false
    }
  }


  return {
    opFormItems,
    opFnName,
    opFormDialog,
    onFormSubmit,
    opCloseForm,
    refreshList
  }
}

export default opFormComponent
