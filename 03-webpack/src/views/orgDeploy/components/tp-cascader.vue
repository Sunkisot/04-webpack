<template>
  <div>
    <el-popover
      v-model="addModel"
      placement="bottom"
      trigger="click"
      width="420"
      popper-class="gv-tree-tag"
    >
      <el-button
        slot="reference"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd"
        :disabled="disabled"
        >{{ btn_txt }}</el-button
      >
      <div class="tree_bd">
        <el-cascader-panel
          ref="cascader"
          v-model="codes"
          :options="options"
          :props="defaultProps"
        >
          <template slot-scope="{ data }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="data.imageName"
              placement="top"
              :open-delay="1500"
            >
              <span>{{ data.imageName }}</span>
            </el-tooltip>
          </template>
        </el-cascader-panel>
      </div>
      <div class="add_btn">
        <el-button size="mini" @click.stop="addModel = false">取消</el-button>
        <el-button size="mini" type="primary" @click.stop="handleSave"
          >保存</el-button
        >
      </div>
    </el-popover>
    <div v-if="tip_txt" class="tip">{{ tip_txt }}</div>
  </div>
</template>

<script>
import { getVideoList } from "@/api/insDeploy";
export default {
  name: "tp-cascader",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    searchObject: {
      // 查询附加参数
      type: [String, Object],
      default: null,
    },
    bizType: {
      // 查询附加参数
      type: String,
      required: true,
    },
    btn_txt: {
      type: String,
      default: "选择保险公司",
    },
    tip_txt: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      addModel: false, // 添加model
      codes: [], // 选中的节点对象
      options: [],
      defaultProps: {
        value: "imageUniqueNumber",
        label: "imageName",
        children: "imageNameList",
        multiple: true,
        emitPath: false,
      },
    };
  },
  methods: {
    // 添加保险公司
    handleAdd() {
      let codes = this.value.map((e) => e.photoId);
      this.codes = codes;
    },
    // 保存tags
    handleSave() {
      let nodes = this.$refs.cascader.getCheckedNodes(true);
      let selected = nodes.map((e) => {
        let obj = this.value.find((v) => v.photoId == e.value);
        let isRequir = obj ? obj.isRequir : 0;
        return {
          bizType: this.bizType,
          photoId: e.value,
          type: e.pathNodes[0].label,
          image: e.label,
          isRequir,
        };
      });
      this.$emit("input", selected);
      this.addModel = false;
    },
    // 初始化数据
    async initData() {
      try {
        let res = await getVideoList(this.searchObject);
        if (res && res.code == "00000") {
          let list = res.data || [];
          this.options = list.map((e) => {
            e.imageName = e.materialType;
            e.imageUniqueNumber = e.id;
            return e;
          });
        }
      } catch (err) {
        this.$message.error("请求失败！");
      }
    },
  },
  watch: {
    searchObject: function searchObject(val, old) {
      if (val && JSON.stringify(val) !== JSON.stringify(old)) {
        this.initData();
      }
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style lang='less'>
.gv-tree-tag {
  padding: 0px;
  height: 400px;
  display: flex;
  flex-direction: column;
  .tree_bd {
    flex: 1;
    padding: 5px;
    overflow: auto;
    .el-cascader-panel {
      height: 100%;
      .el-cascader-menu__wrap {
        height: 100%;
      }
    }
  }
  .add_btn {
    border-top: 1px solid #d7d7d7;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
<style lang='less' scoped>
</style>