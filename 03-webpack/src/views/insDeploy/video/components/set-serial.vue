<template>
  <div>
    <span>{{ row[prop] }}</span>
    <el-popover
      v-model="visible"
      placement="bottom"
      width="200"
      trigger="click"
      @show="handleShow"
    >
      <el-button
        slot="reference"
        type="text"
        icon="el-icon-edit-outline"
      ></el-button>
      <div class="flex-center">
        <gv-input v-model="serial" class="mr10"></gv-input>
        <el-button type="text" @click="handleSave">保存</el-button>
        <span class="ml5 mr5">|</span>
        <el-button type="text" class="txt-red-btn" @click="visible = false"
          >取消</el-button
        >
      </div>
    </el-popover>
  </div>
</template>

<script>
import { putVideoNo } from "@/api/insDeploy";
export default {
  name: "set-serial",
  props: {
    row: Object, // 当前行数据
    prop: {
      type: String,
    },
    cur_icId: null
  },
  data() {
    return {
      visible: false,
      serial: "",
    };
  },
  methods: {
    handleShow() {
      this.visible = true;
      this.serial = this.row[this.prop];
    },
    async handleSave() {
      if (!this.serial) {
        this.$message.warning("序号值不为空!");
        return;
      }
      let res = await putVideoNo({
        id: this.row.id,
        icId: this.cur_icId,
        serialNumer: this.serial,
      });
      if (res && res.code == "00000") {
        this.visible = false;
        this.gvUtil.success();
        this.$event.$emit("refresh");
      } else {
        this.gvUtil.error(res.message);
      }
    },
  },
  created() {},
};
</script>

<style>
</style>