<template>
  <div class="wrapper pd10">
    <div class="content">
      <div class="c_left">
        <div class="cl_head">
          <el-input
            placeholder="输入保险公司名称查找"
            clearable
            v-model="filterText"
          >
          </el-input>
        </div>
        <div class="cl_body">
          <el-tree
            ref="tree"
            class="tree"
            :data="treeData"
            node-key="id"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @current-change="handleCurChange"
          >
            <template #default="scope">
              <div>{{ scope.node.label }}</div>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="c_right">
        <div class="cr_head">
          <div class="crh_left">
            <span class="ml20 mr10">影像资料列表</span>
          </div>
          <div class="crh_right">
            <el-button type="primary" @click="openCopyVisible" plain
              >复制影像资料</el-button
            >
            <el-button type="primary" plain @click="handleInit">初始化配置</el-button>
            <el-button type="primary" @click="handleAdd"
              >新增影像资料</el-button
            >
          </div>
        </div>
        <div class="cr_body">
          <div class="crb_form">
            <video-table :data="tableData" :cur_icId='cur_icId'></video-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 同步影像资料弹窗 -->
    <gv-dialog title="提示" :visible.sync="copyVisible" width="800px">
      <div style="overflow: hidden">
        <gv-form
          ref="form"
          class="form"
          :model="copy_form"
          :rules="rules"
          :col="1"
          label-width="150px"
        >
          <gv-form-item keyName="保险公司" prop="ics">
            <gv-tree-tag
              ref="treeTag"
              v-model="copy_form.ics"
              urlType="IcOption"
              tip_txt="选择需要同步的保险公司，会将当前保险公司的影像资料同步到选择的保险公司"
            ></gv-tree-tag>
          </gv-form-item>
        </gv-form>
      </div>
      <el-row slot="footer" type="flex" justify="center">
        <el-button @click="copyVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </el-row>
    </gv-dialog>
  </div>
</template>

<script>
import { getVideoList, postVideoCopy, getVideoInit } from "@/api/insDeploy";
import { getInsList } from "@/api/sys";
import videoTable from "./components/video-table.vue";
export default {
  name: "vision-index",
  components: {
    videoTable,
  },
  data() {
    return {
      copy_form: {
        ics: [], // 复制的保险公司
      },
      rules: {
        ics: [{ required: true, message: "请选择保险公司", trigger: "blur" }],
      },
      copyVisible: false, // 复制影像资料弹窗
      filterText: "", // 筛选字短
      cur_icId: '', // 目前选中的保险公司的id
      tableData: [],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  methods: {
    // 筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 刷新页面
    refreshPage() {
      this.$router.push({
        path: "/redirect/org-regulate/org-regulate",
      });
    },
    // 打开同步弹窗
    openCopyVisible() {
      const h = this.$createElement;
      this.$msgbox({
        title: "提示",
        message: h("div", null, [
          h("p", null, "是否确认将影像资料复制到其它保险公司？"),
          h(
            "span",
            { class: "tip" },
            "复制后，其它保险公司原有的影像资料将被当前保险公司影像资料覆盖"
          ),
        ]),
        confirmButtonText: "去复制",
        cancelButtonText: "取消",
        type: "info",
        customClass: "info",
        showCancelButton: true,
      })
        .then(async () => {
          this.copyVisible = true;
          this.copy_form.ics = []
        })
        .catch(() => {});
    },
    // 新增
    handleAdd() {
      this.$router.push({
        path: "/ins-deploy/video-add/add",
      });
    },
    // 保存
    async handleSave() {
      let isok = await this.$refs.form.validate();
      console.log(isok, this.copy_form);
      if (!isok) return;
      this.postSave();
    },
    // 初始化配置
    async handleInit() {
      let {code: icCode, id: icId} =  this.$refs.tree.getCurrentNode()
      let res = await getVideoInit({
        icCode,
        icId
      })
      if(res && res.code == '00000') {
        this.gvUtil.success()
        this.proFormData()
      }else {
        this.gvUtil.error(res.message)
      }
    },
    // 复制保存接口
    async postSave() {
      let list = this.$refs.treeTag.getCheckedNodes() || [];
      let res = await postVideoCopy({
        icId: this.$refs.tree.getCurrentKey(),
        syncIcList: list.map((e) => {
          return { icCode: e.code, icId: e.id };
        }),
      });
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.copyVisible = false;
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 切换节点
    handleCurChange(e) {
      this.cur_icId = e.id
      this.proFormData();
    },
    // 获取表单数据
    async proFormData(e) {
      let res = await getVideoList({
        icId: this.$refs.tree.getCurrentKey(),
      });
      if (res && res.code == "00000") {
        this.tableData = res.data || [];
      }
    },
    async getTreeData() {
      let res = await getInsList();
      if (res && res.code == "00000") {
        this.treeData = res.data || [];
        await this.$nextTick();
        this.$refs.tree.setCurrentKey(this.treeData[0].id);
        this.cur_icId = this.treeData[0].id
        this.proFormData();
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {},
  mounted() {
    this.getTreeData();
    this.$event.$on("refresh", () => {
      this.proFormData()
    });
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables.scss";
.content {
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  flex: 1;
  overflow: hidden;
  .c_left {
    flex: 20%;
    display: flex;
    flex-direction: column;
    .cl_head {
      height: 50px;
      background-color: #f4f6f8;
      border-bottom: 1px solid rgba(217, 217, 217, 1);
      line-height: 50px;
      padding: 0 10px;
    }
    .cl_body {
      flex: 1;
      background-color: #f4f6f8;
      overflow: auto;
      .tree {
        background: #f4f6f8;
        /deep/ .el-tree-node__content {
          height: 36px;
        }
        /deep/ .el-tree-node.is-current > .el-tree-node__content {
          background: $primary;
          color: #fff;
        }
      }
    }
  }
  .c_right {
    flex: 80%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .cr_head {
      height: 50px;
      border-bottom: 1px solid rgba(217, 217, 217, 1);
      line-height: 50px;
      text-indent: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .crh_left {
        display: flex;
        align-items: center;
      }
      .crh_right .el-button {
        margin: 0 10px;
        position: relative;
        // &::after {
        //   content: "|";
        //   position: absolute;
        //   color: rgba(217, 217, 217, 1);
        //   right: -15px;
        // }
        // &:last-child::after {
        //   content: "";
        // }
      }
    }
    .cr_body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
      .crb_form {
        flex: 1;
        padding: 10px;
        overflow: auto;
      }
      .crb_btn {
        height: 50px;
        text-align: center;
        line-height: 50px;
        border-top: 1px solid rgba(217, 217, 217, 1);
      }
    }
  }
}
.status_box {
  font-size: 14px;
  color: #fff;
  background: $red;
  width: 70px;
  height: 20px;
  text-align: center;
  text-indent: initial;
  line-height: 20px;
  border-radius: 3px;
}
.success {
  background: $primary;
}
.tip {
  color: #aaaaaa;
  font-size: 12px;
}
</style>