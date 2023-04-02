import { defineComponent, h, defineEmits } from 'vue';
import { ElTag } from 'element-plus';
import { defineProps, defineEmits } from 'vue';

const getTagType = (btnType: string) => {
  let type = 'success';
  switch (btnType) {
    case 'delete':
      type = 'danger';
      break;
    case 'edit':
      type = 'warning';
      break;
    case 'export':
      type = 'info';
      break;
    case 'import':
      type = 'info';
      break;
    case 'add':
      type = 'success';
      break;
    case 'batchDeletion':
      type = 'danger';
      break;
    default:
      type = 'success';
  }
  return type;
};

const emit = defineEmits(['close']);



export default defineComponent({
  components: { ElTag },
  props: {
    name: {
      type: String,
      default: ''
    },
    btnType: {
      type: String,
      default: () => {
        return '';
      }
    },
    btnId: {
      type: String,
      default: ''
    }
  },
  render() {
    let _this = this;
    return h(
      ElTag,
      {
        style: { marginRight: '10px' },
        type: getTagType(this.btnType),
        closable: true,
        // onClick: () => {
        //
        // },close
        // onClose: () => {
        //   // emit('close', this.btnId)
        //   // this.$emit('close', this.btnId);
        //
        //   this.$emit('close', 212122);
        // }
        // onClose:()=> this.handleClose()
        // onClick: () => {
        //   this.$emit('close', { data: 'hello' })
        //
        //  // this.$emit('close', 'Button clicked!')
        // }
         onClose:() => this.$emit('update:close',this.btnId)
      },
      { default: () => this.name }
    );
  },
  methods:{
    handleClose(){
      this.$emit('update:close',this.btnId)
    }
  }

});
