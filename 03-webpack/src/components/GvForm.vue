<template>
  <el-form class="form" v-bind="$attrs" v-on="$listeners" ref="form" :col="col">
    <div class="gv-form">
      <slot></slot>
    </div>
  </el-form>
</template>

<script>
/**
 * form 表单(可控制平分列)
 * @author 计欣奇
 * @time 2020/11/08
 */
export default {
  name: "GvForm",
  provide: function provide() {
    return {
      gvForm: this,
    };
  },

  props: {
    col: {
      // 分几列
      type: [String, Number],
      default: () => 3,
    },
  },
  data: function data() {
    return {};
  },
  methods: {
    validate: async function validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(async (valid, object) => {
          if (valid) {
            resolve(true);
          } else {
            await this.$nextTick();
            let constisError = document.getElementsByClassName("is-error");
            constisError[0].scrollIntoView({
              //滚动到指定节点
              block: "center", //值有start,center,end，nearest，当前显示在视图区域中间
              behavior: "smooth", //值有auto、instant,smooth，缓动动画（当前是慢速的）
            });
            console.log("error submit!!");
            resolve(false);
            return false;
          }
        });
      });
    },
    validateField: function validateField(prop, callBack) {
      this.$refs.form.validateField(prop, function (valid) {
        callBack(valid);
      });
    },
    resetFields: function resetFields() {
      this.$refs.form.resetFields();
    },
    clearValidate: function clearValidate() {
      var props =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      this.$refs.form.clearValidate(props);
    },
  },
  watch: {},
  mounted: function mounted() {},
  created: function created() {},
};
</script>

<style lang='less' scoped>
</style>