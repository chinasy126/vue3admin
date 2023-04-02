<template>
  <el-card class="box-card">
    <el-row>
      <el-form
        class="searchForm"
        ref="searchFormRef"
        :model="searchForm"
        :inline="true"
      >
        <slot></slot>
        <template v-for="(item,index) in prop.itemList">
          <el-col :span="spanNum">
            <slot :name="index"></slot>
            <el-form-item :label="item.name" :key="index" :prop="item.prop" class="searchLabel">
              <!-- 输入框 -->
              <template v-if="item.type === 'input'">
                <el-input
                  v-model="searchForm[item.prop]"
                  :disabled="item.disabled"
                  class="searchValue"
                  :clearable="item.clearable || true"
                ></el-input>
              </template>

              <template v-if="item.type === 'date'">
                <el-date-picker
                  v-model="searchForm[item.prop]"
                  :disabled="item.disabled"
                  :clearable="item.clearable || true"
                  type="date"
                  value-format="YYYY-MM-DD"
                />
              </template>

            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>

    <div class="searchBtnList">
      <el-button
        type="primary"
        @click="handlerEventSearch"
        class="btnSearch"
        :loading="searchBtnLoading"
      >查询
      </el-button>
      <el-button type="primary" @click="handlerReset(searchFormRef)">重置</el-button>
      <slot name="operationButton"></slot>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import {defineProps, ref, defineExpose} from "vue";
import {FormInstance} from "element-plus";
// 有多少列的宽度
const spanNum = ref(6);
// 搜索每一项值
let searchForm = ref({})
// 表单实例
const searchFormRef = ref<FormInstance>()

const emit = defineEmits(['onSearch'])

/**
 * 点击搜索
 */
const handlerEventSearch = () => {
  const params = {}
  prop.itemList.forEach(item => {
    switch (item.type) {
      case 'input':
        params[item.prop] = searchForm.value[item.prop]
        break
      case 'date':
        params[item.prop] = searchForm.value[item.prop]
    }
  })
  emit('onSearch', params)
}
/**
 * 表单重置
 * @param formEl
 */
const handlerReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  this.$emit('reset') //清除slot内嵌的form元素数据
}

const prop = defineProps({
  // 列表项目
  itemList: {
    type: Array,
    default: () => [
      {
        type: 'input',
        name: '名称',
        prop: 'name',
        labelCol: 6,
        wrapperCol: 14,
        disabled: false, // 用于控制是否可以输入 默认flase
        value: ''
      }
    ]
  },
  // 查询按钮状态
  searchBtnLoading: {
    type: Boolean,
    default: false
  }
})

defineExpose({
  searchForm
})


</script>

<style scoped lang="less">
.searchForm {
  width: 100%;
  display: flex;
}

.searchBtnList {
  display: flex;
  justify-content: flex-end;
}
</style>
