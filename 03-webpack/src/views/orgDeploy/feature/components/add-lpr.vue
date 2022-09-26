<template>
  <div>
    <el-popover
      v-model="addModel"
      placement="bottom"
      trigger="click"
      width="300"
      popper-class="add-lpr"
    >
      <el-button
        slot="reference"
        type="text"
        icon="el-icon-plus"
        @click="handleAdd"
        :disabled='disabled'
        >添加</el-button
      >
      <div class="content">
        <el-input ref="addInput" class="mr10" v-model="addVal" @keyup.enter.native='handleSave'></el-input>
        <el-button type="text" @click.stop="handleSave">保存</el-button>
        <el-button
          class="txt-red-btn"
          type="text"
          @click.stop="addModel = false"
          >取消</el-button
        >
      </div>
    </el-popover>
    <div v-if="tip_txt" class="tip">{{ tip_txt }}</div>
    <div class="tags mb20">
      <el-tag
        class="tagItem"
        v-for="(tag, i) in this.codes"
        :key="i"
        :closable='!disabled'
        @close="handleTagClose(tag, i)"
      >
        {{ tag }}
      </el-tag>
    </div>
  </div>
</template>

<script>
export default {
  name: "add-lpr",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tip_txt: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      addVal: "",
      addModel: false, // 添加model
      codes: [],
    };
  },
  methods: {
    updateValue: function updateValue() {
      this.$emit("input", this.codes);
      this.$emit("change", this.codes);
    },
    // 添加
    handleAdd() {
      this.addVal = "";
      setTimeout(() => {
        this.$refs.addInput.focus();
      },0)
      
      // this.$refs.tree.setCheckedKeys(this.codes);
    },
    // 保存tags
    handleSave() {
      if (!this.gvUtil.PATTERN_LPR.test(this.addVal)) {
        this.$message.error("输入车牌号格式正确！");
        return;
      }
      if(this.codes.includes(this.addVal)) {
        this.$message.error("输入车牌号格式重复！");
        return
      }
      this.codes.push(this.addVal);
      this.updateValue();
      this.addModel = false;
    },
    // 关闭tags
    handleTagClose(e, i) {
      this.codes.splice(i, 1);
      this.updateValue();
    },
  },
  watch: {
    value: {
      handler(val) {
        this.codes = JSON.parse(JSON.stringify(val));
      },
      deep: true,
    },
  },
  created() {},
};
</script>

<style lang='less'>
.add-lpr {
  padding: 4px;
  .content {
    display: flex;
  }
}
</style>
<style lang='less' scoped>
.tags {
  max-height: 130px;
  overflow-y: scroll;
  .tagItem {
    margin-right: 10px;
    margin-bottom: 10px;
    float: left;
  }
}
.tip {
  font-size: 12px;
  line-height: 1.5;
  color: #aaaaaa;
  margin-bottom: 4px;
}
</style>