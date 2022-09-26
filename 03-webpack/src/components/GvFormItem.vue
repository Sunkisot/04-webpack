<template>
  <el-col ref="elCol" :span="span">
    <el-form-item
      v-bind='$attrs'
      v-on="$listeners"
      :id="'formItem_' + id"
      class="gvFormItem"
      :label="keyName | translate"
    >
      <template #label>
        <slot name="label"></slot>
      </template>
      <slot></slot>
    </el-form-item>
  </el-col>
</template>

<script>
/**
 * 配合gv-form可实现动态平分列展示
 * @author 计欣奇
 * @time 2020/11/08
 */
var id = 0;
var labelWidth = 0
import $ from "jquery";
export default {
  name: "gvFormItem",
  inject: ["gvForm"],
  props: {
    keyName: {
      type: String,
      default: "",
    },
    holdCol: {
      // 占几列
      type: [String, Number],
      default: () => 1,
    },
  },
  data() {
    return {
      span: 8,
      currency: "",
      id: 0,
    };
  },
  methods: {},
  async mounted() {
    let l = 24 / Number(this.gvForm.col);
    this.span = Math.floor(Number(this.holdCol) * l) 
    let w = (100 / Number(this.gvForm.col)) * 0.35;
     
    if (this.holdCol !== 1) {
      $("#formItem_" + this.id).find('.el-form-item__label').css({
        width: w + '%'
      })
      $("#formItem_" + this.id).find('.el-form-item__content').css({
        width: 100 - w + '%'
      })
    }
    await this.$nextTick()
    if(this.id === 1) {
      labelWidth = $("#formItem_1").find('.el-form-item__label')[0].getBoundingClientRect().width
    }
    $(this.$refs.elCol.$el).parent('.el-row').css({
      marginRight: labelWidth - 50 + 'px'
    })
    this.$forceUpdate()
  },
  created() {
    id++;
    this.id = id;
  },
};
</script>

<style lang='scss' scoped>
.gvFormItem {
  width: 100%;
  /deep/.el-form-item__label {
    width: 35%;
  }
  /deep/.el-form-item__content {
    width: 65%;
  }
}
.gvFormItem /deep/ .el-select,
.gvFormItem /deep/ .el-cascader,
.gvFormItem /deep/ .el-date-editor{
  width: 100%;
}
.gvFormItem /deep/.el-date-editor .el-range-separator {
  width: 10%;
}
.gvFormItem /deep/.el-form-item {
  width: 100%;
  .el-form-item__content {
    width: 100%;
  }
}
</style>