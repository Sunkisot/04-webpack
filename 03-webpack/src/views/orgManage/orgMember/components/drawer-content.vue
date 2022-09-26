<template>
  <div class="connect">
    <div class="mb20 flex-align-center">
      <div class="title">成员角色</div>
      <gv-select
        ref="roleSelect"
        url="/system/mechanism/role/optionList"
        codeName="id"
        labelName="name"
        v-model="form.roleId"
        @select="roleChange"
        :searchObject="{ mechanismId: topFormData.mechanismId }"
        :disabled="isReadOnly"
        :isCache='false'
      ></gv-select>
    </div>
    <div class="mb20 flex">
      <div class="title mt7">保险公司</div>
      <gv-tree-tag
        ref="treeTag"
        style="flex: 1"
        v-model="form.insurerList"
        urlType="IcOption"
      ></gv-tree-tag>
    </div>
    <div class="mb10 flex-align-center">
      <div class="title">机构组织</div>
    </div>
    <div class="tp-tree">
      <tp-tree ref="tpTree" :dataList="dataList"></tp-tree>
    </div>
  </div>
</template>

<script>
import { getOrgSonTree } from "@/api/orgManage";
import tpTree from "./tp-tree";
export default {
  name: "drawer-content",
  components: {
    tpTree,
  },
  props: {
    formData: {
      type: Object,
    },
  },
  data() {
    return {
      isReadOnly: false,
      addModel: false, // 添加model
      form: {
        insurerList: [],
        mechanismIdList: [
          "1402192973284175873",
          "1402192655225909249",
          "1402192909203599361",
          "1402192707650514945",
        ],
      },
      tagTreeData: [
        {
          id: "",
          name: "全部",
          children: [],
        },
      ],
      dataList: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      topFormData: {},
    };
  },
  methods: {
    getForm() {
      return {
        ...this.form,
        mechanismIdList: this.$refs.tpTree.getChekedKeys(),
      };
    },
    // 角色change
    roleChange(e) {
      if (!e) return;
      this.form.roleName = e.name;
    },
    // 区分顶级的子机构
    proOrgTreeChecked(data, cheked) {
      let checked = {};
      data.forEach((e) => {
        if (e.children && e.children.length) {
          checked[e.id] = this.proTreeData(e.children, cheked);
        } else {
          checked[e.id] = [];
        }
      });
      return checked;
    },
    proTreeData(data, cheked) {
      let l = [];
      data.forEach((e) => {
        if (cheked.includes(e.id)) {
          l.push(e.id);
        }
        if (e.children && e.children.length) {
          let v = this.proTreeData(e.children, cheked);
          v.length && l.push(...v);
        }
      });
      return l;
    },
    // 获取机构树
    async getOrgSonTree(callback) {
      let res = await getOrgSonTree({
        parentId: this.formData.mechanismId,
      });
      if (res && res.code == "00000") {
        this.dataList = res.data || [];
        typeof callback == "function" && callback();
      } else {
        this.gvUtil.error(res.message);
      }
    },
    async handleCheckTree() {
      let checked = this.proOrgTreeChecked(
        this.dataList,
        this.form.mechanismIdList
      );
      await this.$nextTick();
      this.$refs.tpTree.initComponent(checked);
    },
    initComponent(obj, formData) {
      this.form = obj;
      this.topFormData = formData; // 外层form
      this.$refs.treeTag.initData();
      this.getOrgSonTree(() => {
        this.handleCheckTree();
      });
    },
  },
  mounted() {},
  created() {
    this.getOrgSonTree();
  },
};
</script>

<style lang='less' scoped>
.connect {
  padding: 0 30px;
  .title {
    width: 60px;
    margin-right: 10px;
    &::before {
      content: "*";
      color: red;
    }
  }
  .tags {
    max-height: 130px;
    overflow-y: scroll;
    .tagItem {
      margin-right: 10px;
      margin-bottom: 10px;
      float: left;
    }
  }
  .tagAdd {
    position: relative;
    .tree_add {
      position: absolute;
      width: 250px;
      height: 300px;
      top: 40px;
      left: 65px;
      z-index: 100;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
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
  }
  .tp-tree {
    margin-bottom: 52px;
  }
}
</style>