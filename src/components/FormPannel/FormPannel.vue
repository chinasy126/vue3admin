<template>
  <el-dialog
    width='600px'
    append-to-body
    :model-value='opFormDialog.visible'
    :title='opFormDialog.title'
    @close='closeForm'
  >
    <el-form
      ref='opFormModelRef'
      :model='opFormModel' :rules='opFormRules'
      :label-width='labelWidth'
      class='demo-ruleForm'
      status-icon
      label-width='80px'
    >
      <template v-for='(item,index) in prop.opFormItems' :key='index'>
        <slot :name='index'></slot>
        <el-form-item :label='item.label' :prop='item.prop'>
          <template v-if="item.type === 'input'">
            <el-input v-model='opFormModel[item.prop]' clearable />
          </template>
          <template v-if="item.type === 'textarea'">
            <el-input v-model='opFormModel[item.prop]' type='textarea' clearable />
          </template>
          <template v-if="item.type === 'date'">
            <el-date-picker value-format='YYYY-MM-DD' v-model='opFormModel[item.prop]' type='date' clearable />
          </template>
          <template v-if="item.type === 'number'">
            <el-input-number v-model='opFormModel[item.prop]'></el-input-number>
          </template>
          <template v-if="item.type === 'select'">
            <el-select v-model='opFormModel[item.prop]' placeholder='请选择' filterable clearable>
              <el-option v-for='slectItem in item.selectValue'
                         :key='slectItem.value'
                         :label='slectItem.label'
                         :value='slectItem.value'
                         :disabled='slectItem.disabled || false'
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </template>
      <slot name='-1'></slot>
      <el-form-item>
        <el-button type='primary' :loading='opFormBtnLoading' @click='submitForm()'>
          {{ prop.opFormDialog.title }}
          <!--          {{ opFormDialog.buttonTitle }}-->
        </el-button>
        <el-button @click='closeForm()'>取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script setup lang='ts'>
import { onBeforeMount, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { isNull } from '@/utils';
import { defineProps } from 'vue';
import { insertData } from '@/api/permission/user';
import { ElForm, ElMessage } from 'element-plus';

const emit = defineEmits(['opCloseForm', 'onFormSubmit']);
const prop = defineProps({
  opCustomFormItems: {
    type: Object,
    default: {}
  },
  opFormDialog: {
    type: Object,
    default: () => {
      return {};
    }
  },
  // 表单的文字左侧距离
  labelWidth: {
    type: String,
    default: () => {
      return '120px';
    }
  },
  // 表单验证规则
  opFormRules: {
    type: Object,
    default: () => {
      return {};
    }
  },
  opFnName: {
    type: Function,
    default: () => {
      return () => {
      };
    }
  },
  // 父组件传递循环的Item 每一项
  opFormItems: {
    type: Array,
    default: () => {
      return [
        {
          label: '所属角色',
          prop: 'roleId',
          type: 'select',
          value: [{ id: 1, label: 1, value: 1 }],
          showValue: true
        }
      ];
    }
  },

  opCustomFormItems: {
    type: Object,
    default: () => {
      return {};
    }
  }

});

let { opFormDialog } = prop;

const opFormModelRef = ref(ElForm);
// 绑定表单的每一个值
const opFormModel = ref({});
// const state = reactive({
//   opFormModel:{}
// });

const opFormBtnLoading = ref(false);

/**
 * 关闭表单
 */
function closeForm() {
  emit('opCloseForm');
}

/**
 *  获取表单每一项目
 */
const getFormProp = () => {
  let obj = {};
  prop.opFormItems.forEach(item => {
    if (item.type === 'number' && isNull(item.value)) {
      obj[item.prop] = isNull(item.value);
    } else {
      if (typeof (item.showValue) !== 'undefined' && item.showValue === false) {
        obj[item.prop] = '';
      } else {
        obj[item.prop] = isNull(item.value);
      }
    }
  });

  // state.opFormModel = obj
  opFormModel.value = obj;
};

/**
 * 提交表单内容
 */
const submitForm = () => {
  opFormModelRef.value.validate(async (valid: any) => {
    if (valid) {
      let params = { ...opFormModel.value, ...prop.opCustomFormItems };
      emit('onFormSubmit', params);
      // opFormBtnLoading.value = true
      // try {
      //   const result: any = await prop.opFnName(params)
      //   if (result.code === 20000) {
      //     ElMessage({message: `操作成功`, grouping: true, type: 'success',})
      //   } else {
      //     ElMessage({message: `${result.message}`, grouping: true, type: 'error',})
      //   }
      // } catch (e) {
      //   console.error(e)
      // } finally {
      //   opFormBtnLoading.value = false
      //   opFormDialog.visible = false
      //   emit('onFormSubmit', params);
      // }

    }
  });
};

watch(() => prop.opFormItems, (newVal, oldVal) => {
  // 匹配表单每一项
  getFormProp();
}, { deep: true, immediate: true });

onMounted(() => {

});

</script>

<style scoped>

</style>
