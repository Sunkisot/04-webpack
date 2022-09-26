<template>
  <div class="tp-tree">
    <div class="tree_head">
      <div @click="handleChecked" class="checkBtn flex-align-center mr20 ml10">
        <span class="check mr10"></span>选中子机构
      </div>
      <div @click="handleNoCheck" class="checkBtn flex-align-center mr20 ml10">
        <span class="cannel mr10"></span>取消选中子机构
      </div>
    </div>
    <div class="tree_body">
      <div class="bd_left">
        <div
          :class="['left-item', { 'is-active': activeNum == i }]"
          v-for="(item, i) in dataList"
          :key="item.id"
          @click="handleSwitch(i)"
        >
          <el-tooltip
            effect="dark"
            :content="item.name"
            placement="top"
            :open-delay='500'
          >
            <div class="t-one">{{ item.name }}</div>
          </el-tooltip>
          <i class="el-icon-arrow-right mr10"></i>
        </div>
      </div>
      <div class="bd_right">
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="id"
          highlight-current
          check-strictly
          :expand-on-click-node="false"
          default-expand-all
          :props="defaultProps"
          @check="handleCheckChange"
        >
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tp-tree",
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeNum: 0,
      findObj: null,
      defaultProps: {
        children: "children",
        label: "name",
      },
      checked: {},
    };
  },
  methods: {
    getChekedKeys() {
      let l = [];
      for (var e in this.checked) {
        l.push(...this.checked[e]);
      }
      return l;
    },
    // 节点选中变化
    handleCheckChange(e, data) {
      let { checkedKeys } = data;
      this.checked[this.dataList[this.activeNum].id] = checkedKeys;
    },
    // 切换选中顶级机构
    handleSwitch(i) {
      this.activeNum = i;
      this.$refs.tree.setCheckedKeys(
        this.checked[this.dataList[this.activeNum].id] || []
      );
      this.$refs.tree.setCurrentKey(null);
    },
    // 取消选中子机构
    handleNoCheck() {
      this.proCheckSon(false);
    },
    // 选中子机构
    handleChecked() {
      this.proCheckSon(true);
    },
    proCheckSon(flag) {
      let key = this.$refs.tree.getCurrentKey();
      if (key) {
        // 有选中
        this.proFindKey(key, this.activeNum);
      } else {
        // 无选中
        this.findObj = this.dataList[this.activeNum];
      }
      let sonKeys = this.proObtainKeys(this.findObj.children || []); // 选中节点下所有子节点的key
      let curKeys = this.checked[this.dataList[this.activeNum].id] || []; // 当前选中key
      if (flag) {
        // 选中
        sonKeys.forEach((e) => {
          if (!curKeys.includes(e)) curKeys.push(e);
        });
      } else {
        // 取消选中
        curKeys = curKeys.filter((e) => !sonKeys.includes(e));
      }
      this.checked[this.dataList[this.activeNum].id] = curKeys;
      this.$refs.tree.setCheckedKeys(curKeys);
    },
    // 获取当前节点下所有子节点
    proObtainKeys(childrens) {
      return childrens.reduce((t, e) => {
        t.push(e.id);
        if (e.children && e.children) {
          t.push(...this.proObtainKeys(e.children));
        }
        return t;
      }, []);
    },
    // 查找当前选中节点
    proFindKey(key, index) {
      let treeData = this.dataList[index]
        ? this.dataList[index].children || []
        : [];
      return this.findID(treeData, key);
    },
    findID(treeData, key) {
      treeData.find((e) => {
        if (e.id == key) {
          this.findObj = e;
          return true;
        } else {
          return e.children && this.findID(e.children, key);
        }
      });
    },
    initComponent(data) {
      this.checked = data;
      this.handleSwitch(0);
    },
  },
  computed: {
    treeData() {
      return this.dataList[this.activeNum]
        ? this.dataList[this.activeNum].children || []
        : [];
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables.scss";
.tp-tree {
  width: 100%;
  .tree_head {
    height: 40px;
    background: #f5f7f9;
    border-bottom: 1px solid #d7d7d7;
    display: flex;
    align-items: center;
    .checkBtn {
      cursor: pointer;
    }
  }
  .tree_body {
    display: flex;
    height: 500px;
    .bd_left {
      flex: 35%;
      background: #f2f2f2;
      .left-item {
        height: 40px;
        cursor: pointer;
        // line-height: 35px;
        text-indent: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 500;
      }
      .left-item.is-active {
        background-color: #fff;
        color: $primary;
      }
    }
    .bd_right {
      flex: 65%;
      overflow: auto;
      padding: 10px;
    }
  }
}
.check {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: $primary;
  position: relative;
  &::before {
    content: "";
    width: 6px;
    height: 1px;
    background: #fff;
    z-index: 10;
    position: absolute;
    top: 7px;
    left: 4px;
  }
}
.cannel {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: $red;
  position: relative;
  &::before {
    content: "";
    width: 10px;
    height: 1px;
    background: #fff;
    z-index: 10;
    position: absolute;
    top: 7px;
    left: 2px;
    transform-origin: center;
    transform: rotate(45deg);
  }
  &::after {
    content: "";
    width: 10px;
    height: 1px;
    background: #fff;
    z-index: 10;
    position: absolute;
    top: 7px;
    left: 2px;
    transform-origin: center;
    transform: rotate(-45deg);
  }
}
</style>