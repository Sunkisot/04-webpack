<template>
  <div>
    <el-popover
      v-model="addModel"
      placement="bottom"
      trigger="click"
      width="300"
      popper-class="gv-tree-tag"
      :disabled='disabled'
    >
      <span slot="reference" @click="handleAdd">
        <slot name="reference" >
          <el-button
            slot="reference"
            type="text"
            icon="el-icon-plus"
            :disabled="disabled"
            >{{ btn_txt }}</el-button
          >
        </slot>
      </span>
      <div class="tree_search">
        <el-input :placeholder="placeholder" clearable v-model="filterText">
        </el-input>
      </div>
      <div class="tree_bd">
        <el-tree
          ref="tree"
          :data="tagTreeData"
          show-checkbox
          :node-key="nodeKey"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :props="defaultProps"
        >
        </el-tree>
      </div>
      <div class="add_btn">
        <el-button size="mini" @click.stop="addModel = false">取消</el-button>
        <el-button size="mini" type="primary" @click.stop="handleSave"
          >保存</el-button
        >
      </div>
    </el-popover>
    <div v-if="tip_txt" class="tip">{{ tip_txt }}</div>
    <div class="tags" v-if="showTag">
      <el-tag
        class="tagItem"
        v-for="(tag, i) in this.tagTreeData[0].children.filter((e) =>
          codes.includes(e[nodeKey])
        )"
        :key="tag[nodeKey]"
        :closable="!disabled"
        @close="handleTagClose(tag, i)"
        @click="handleClick(tag[nodeKey])"
        :effect="tagClick && curkey == tag[nodeKey] ? 'dark' : 'light'"
      >
        {{ tag.name }}
      </el-tag>
    </div>
  </div>
</template>

<script>
/**
 * 树形tag选择框
 * @author 计欣奇
 * @time 2020/11/08
 */
import { getUrlList } from "@/api/system/gvSelect";
import select from "@/api/select";
export default {
  name: "GvTreeTag",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "输入机构名称查找",
    },
    urlType: {
      type: String,
      default: "",
    },
    requestType: {
      type: String,
      default: "get",
    },
    searchObject: {
      // 查询附加参数
      type: [String, Object],
      default: null,
    },
    "show-tag": {
      type: Boolean,
      default: true,
    },
    "tag-click": {
      // 是否开启节点点击
      type: Boolean,
      default: false,
    },
    "node-key": {
      type: String,
      default: "id",
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
      filterText: "",
      addModel: false, // 添加model
      tagTreeData: [
        {
          id: "",
          name: "全部",
          children: [],
        },
      ],
      defaultProps: {
        children: "children",
        label: "name",
      },
      codes: [], // 选中的code
      nodes: [], // 选中的节点对象
      curkey: null,
      curNode: null,
    };
  },
  methods: {
    setCurrentKey(key) {
      this.curkey = key;
    },
    updateValue: function updateValue() {
      this.$emit("input", this.codes);
      this.$emit("change", this.codes);
    },
    getCheckedNodes() {
      return this.nodes || [];
    },
    getCurrentKey() {
      return this.curkey || null;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 添加保险公司
    handleAdd() {
      this.$refs.tree.setCheckedKeys(this.codes);
    },
    handleClick(key) {
      if (this.curkey != key) {
        this.curkey = key;
        this.$emit("tag-change", key);
      }
    },
    // 保存tags
    handleSave() {
      let keys = this.$refs.tree.getCheckedKeys();
      let nodes = this.$refs.tree.getCheckedNodes();
      if (!keys[0]) {
        keys.splice(0, 1); // 删除全部节点
        nodes.splice(0, 1);
      }
      this.codes = keys;
      this.nodes = nodes;
      this.curkey = keys[0];
      this.$emit("save", this.codes);
      this.updateValue();
      this.addModel = false;
    },
    // 关闭tags
    handleTagClose(e, i) {
      this.codes.splice(i, 1);
      this.$emit("save", this.codes);
      this.updateValue();
    },
    proData(list) {
      // 处理数组元素不是对象的情况
      if (_typeof(list[0]) == "object") {
        return list;
      } else {
        return list.map((e) => {
          return {
            id: e,
            name: e,
          };
        });
      }
    },
    // 初始化数据
    async initData() {
      var url = select[this.urlType];
      try {
        let res = await getUrlList(url, this.searchObject, this.requestType);
        if (res && res.code == "00000") {
          this.tagTreeData[0].children = res.data ? this.proData(res.data) : [];
        }
      } catch (err) {
        this.$message.error("请求失败！");
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    value: {
      handler(val) {
        this.codes = JSON.parse(JSON.stringify(val)) || [];
        if (!this.codes.includes(this.curkey)) {
          this.curkey = this.codes[0];
        }
      },
      deep: true,
    },
    curkey(val, oldVal) {
      this.$emit("curkey-change", {
        val,
        oldVal,
      });
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
  .tree_search {
    padding: 5px;
  }
  .tree_bd {
    flex: 1;
    padding: 5px;
    overflow: auto;
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
.tags {
  max-height: 180px;
  overflow-y: scroll;
  .tagItem {
    margin-right: 10px;
    margin-bottom: 10px;
    float: left;
    cursor: pointer;
  }
}
.tip {
  font-size: 12px;
  line-height: 1.5;
  color: #aaaaaa;
  margin-bottom: 4px;
}
</style>