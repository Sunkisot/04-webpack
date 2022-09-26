<template>
  <transition name="fade">
    <div @click="onClick">
      <el-input v-model="color" :placeholder="placeholder" readonly>
        <template #suffix>
          <el-color-picker
            v-bind="$attrs"
            ref="color"
            class="gvColor"
            v-model="color"
            :disabled='disabled'
            @change="$emit('input', color)"
          ></el-color-picker>
        </template>
      </el-input>
    </div>
  </transition>
</template>

<script>
/**
 * 颜色选择框
 * @author 计昕奇
 * @time 2017/11/08
 */
export default {
  name: "GvColorPicker",
  props: {
    value: [String],
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: function (vm) {
    return {
      color: "",
    };
  },
  methods: {
    onClick() {
      if (this.disabled) return;
      this.$refs.color.showPicker = true;
    },
  },
  watch: {
    value(val) {
      this.color = val;
    },
  },
  created() {},
};
</script>

<style lang='less' scoped>
.gvColor /deep/ .el-color-picker__trigger {
  border: none;
}
</style>