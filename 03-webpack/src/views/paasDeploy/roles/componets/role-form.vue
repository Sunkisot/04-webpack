<template>
  <gv-form
    ref="form"
    class="form"
    :rules="rules"
    :model="form"
    :col="1"
    label-width="200px"
  >
    <div class="common">
      <div class="title">角色信息</div>
      <el-row class="collapse-content">
        <gv-form-item keyName="角色名称" prop="roleName">
          <el-input
            v-model="form.roleName"
            placeholder="输入角色名称"
            maxlength="20"
          ></el-input>
        </gv-form-item>
        <gv-form-item keyName="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.remark"
            placeholder="输入角色名称"
            maxlength="500"
            show-word-limit
          ></el-input>
        </gv-form-item>
      </el-row>
    </div>
    <div class="title">
      <span>角色权限</span>
      <span class="f-12 c-7F7F7F">（该角色享有的后台模块及功能权限）</span>
    </div>
    <el-row class="tree-content">
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :props="defaultProps"
        @check="handleCheckChange"
      >
      </el-tree>
    </el-row>
  </gv-form>
</template>

<script>
export default {
  name: "role-form",
  props: {
    formData: {
      // 表单数据
      type: Object,
      default: () => {},
    },
    treeData: {
      // 表单数据
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {
        roles: [],
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      defaultProps: {
        children: "children",
        label: "menuName",
      },
    };
  },
  methods: {
    // 获取表单数据
    async getFormData() {
      let isok = await this.$refs.form.validate();
      return isok ? this.form : null;
    },
    getForm() {
      return this.form;
    },
    handleCheckChange() {
      this.form.menuIdList = [
        ...arguments[1].checkedKeys,
        ...arguments[1].halfCheckedKeys,
      ];
    },
  },
  watch: {
    formData: {
      async handler(val, old) {
        this.form = JSON.parse(JSON.stringify(val));
        await this.$nextTick();
        let l = this.form.menuIdList || [];
        let checkedCodes = l.reduce((t, e) => {
          if (e.length === 4) {
            t.push(e);
          }
          return t;
        }, []);
        this.$refs.tree.setCheckedKeys(checkedCodes);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang='less' scoped>
.wrapper {
  padding: 0 20px;
  min-height: 100vh;
  .form {
    margin-bottom: 50px;
    .common {
      border-bottom: 1px solid #e9e9e9;
    }
    .collapse-content {
      max-width: 800px;
    }
    .tree-content {
      max-width: 800px;
      padding-left: 50px;
      overflow: auto;
    }
    .title {
      font-size: 15px;
      font-weight: 500;
      padding: 15px 20px;
    }
  }
}
</style>