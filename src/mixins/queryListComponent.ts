import {nextTick, onMounted, ref} from "vue";
import {ElMessage} from "element-plus";

const queryListComponent = () => {

  const getListFnName = ref() // 查询接口API
  const selectItemList = ref([])// 多选择的结果集
  const searchForm = ref({})
  const searchBtnLoading = ref(false)   // 查询按钮的状态
  const pageNum = ref(1) // 当前页码
  const pageSize = ref(10)  // 每页显示条数
  const totalPage = ref(0)  // 总页数
  const totalCount = ref(0)  // 总条数
  const dataSource = ref([]) // 表格数据源
  const tableLoading = ref(false) // 表格加载状态

  /**
   * 搜索
   * @param params
   */
  const handleEventSearch = async (params: any) => {
    searchForm.value = {...params}
    await getItemList()
  }

  /**
   * 查询TABLE列表
   */
  const getItemList = async () => {
    searchBtnLoading.value = true
    tableLoading.value = true
    const params = {...searchForm.value}

    try {
      const res: any = await getListFnName.value(params, pageNum.value, pageSize.value)
      if (res.code === 20000) {
        const result = res.data.data
        const {total, current, size, records} = result
        totalCount.value = total
        pageNum.value = current
        pageSize.value = size
        dataSource.value = records
      } else {
        ElMessage({message: `${res.message}`, grouping: true, type: 'error',})
        dataSource.value = []
      }
    } catch (e) {
      console.error(e)
    } finally {
      searchBtnLoading.value = false
      tableLoading.value = false
    }
  }

  /**
   * 改变每页数量
   * @param size
   */
  const changeSize = async (size: number) => {
    pageSize.value = size
    await getItemList()
  }

  /**
   * 改变页码
   * @param pageNum
   */
  const changeNum = async (num: number) => {
    pageNum.value = num
    await getItemList()
  }

  /**
   *  选择行
   */
  const handleSelectionChange = (rows: any) => {
    selectItemList.value = rows
  }

  onMounted(async () => {
    await nextTick(() => {
      getItemList()
    })
  })

  return {
    selectItemList,
    getListFnName,
    searchBtnLoading,
    pageNum,
    pageSize,
    totalCount,
    dataSource,
    handleEventSearch,
    getItemList,
    changeSize,
    changeNum,
    handleSelectionChange
  }
}


export default queryListComponent
