<template>
  <div class="wrapper">
    <gv-form
      ref="form"
      class="form form_body pd20"
      :model="form"
      :rules="rules"
      :col="1"
      label-width="200px"
    >
      <gv-collapse open-all disabled>
        <gv-collapse-item title="角色信息" name="1">
          <el-row class="collapse-content">
            <gv-form-item keyName="角色归属机构" prop="mechanismId">
              <gv-tree-select
                v-model="form.mechanismId"
                urlType="OrgTree"
                placeholder="选择角色归属机构"
                @select="selectChange"
              ></gv-tree-select>
            </gv-form-item>
            <gv-form-item keyName="角色名称" prop="roleName">
              <el-input
                v-model="form.roleName"
                placeholder="输入角色名称"
                maxlength="20"
              ></el-input>
            </gv-form-item>
            <gv-form-item keyName="所有子机构是否可用" prop="childOrgIsUsable">
              <el-radio-group v-model="form.childOrgIsUsable">
                <el-radio
                  v-for="item in gvUtil.options.whether"
                  :key="item.code"
                  :label="item.code"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
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
        </gv-collapse-item>
        <gv-collapse-item name="2" disbaled>
          <template #title>
            <span>角色权限</span>
            <span class="f-12 c-7F7F7F"
              >（该角色享有的后台模块及功能权限）</span
            >
          </template>
          <el-row class="tree-content">
            <el-tree
              v-if="form.mechanismId"
              ref="tree"
              :data="treeData"
              show-checkbox
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              :props="defaultProps"
            >
            </el-tree>
            <div v-else class="noData">
              <span>暂无数据</span><br />
              <span class="f-12 c-7F7F7F">(请先选择角色归属机构)</span>
            </div>
          </el-row>
        </gv-collapse-item>
      </gv-collapse>
    </gv-form>
    <div class="bottom_btn_row">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  postAddRole,
  putAddRole,
  getRoleDetail,
  getMenuTree,
} from "@/api/orgManage";
export default {
  name: "add-role",
  props: {
    type: null,
  },
  data() {
    return {
      form: {
        mechanismId: null,
        roleName: "",
        childOrgIsUsable: 1,
        remark: "",
        menuIdList: [],
      },
      rules: {
        mechanismId: [
          {
            required: true,
            message: "角色归属机构不能为空",
            trigger: "change",
          },
        ],
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "change" },
        ],
      },
      treeData: [
        {
          id: "",
          menuName: "全部权限",
          children: [],
        },
      ],
      defaultProps: {
        children: "children",
        label: "menuName",
      },
    };
  },
  methods: {
    // 机构改变
    async selectChange(e) {
      if (!e) {
        this.treeData[0].children = [];
        return;
      }
      await this.getMenuTree(e.id);
      await this.$nextTick();
      this.$refs.tree.setCheckedKeys([]);
    },
    // 保存
    async handleSave() {
      let isok = await this.$refs.form.validate();
      if (!isok) return;
      this.postSave();
    },
    // 保存接口
    async postSave() {
      let menuIdList = this.$refs.tree.getCheckedKeys(false) || []; // 全勾选
      let halfMenuIdList = this.$refs.tree.getHalfCheckedKeys() || []; // 半勾选
      this.form.menuIdList = [...menuIdList, ...halfMenuIdList];
      let res =
        this.type == "add"
          ? await postAddRole(this.form)
          : await putAddRole(this.form);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.$router.push({ name: "orgRole" });
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 初始化详情数据
    async initDetail() {
      try {
        let res = await getRoleDetail({
          roleId: this.querys.roleId,
        });
        if (res && res.code == "00000") {
          this.form = res.data || {};
          await this.getMenuTree(this.form.mechanismId);
          await this.$nextTick();
          let menuIdList = res.data.menuIdList || [];
          let checkedCodes = menuIdList.reduce((t, e) => {
            if (e.length === 4) {
              t.push(e);
            }
            return t;
          }, []);
          this.$refs.tree.setCheckedKeys(checkedCodes);
        }
      } catch (err) {}
    },
    // 获取权限树
    getMenuTree(id) {
      return new Promise(async (resolve) => {
        let res = await getMenuTree({
          roleId: this.querys.roleId,
          mechanismId: id,
        });
        if (res && res.code == "00000") {
          this.treeData[0].children = res.data || [];
          resolve();
        }
      });
    },
  },
  created() {
    this.type == "edit" && this.initDetail();
  },
};
</script>

<style lang='less' scoped>
.wrapper {
  .form {
    .collapse-content {
      max-width: 800px;
    }
    .tree-content {
      max-width: 800px;
      max-height: 600px;
      padding-left: 50px;
      overflow: auto;
      .noData {
        margin-top: 20px;
        text-align: center;
      }
    }
  }
}
</style>