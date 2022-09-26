<template>
  <div class="risk-content">
    <el-tabs class="rc_tabs" v-model="activeName">
      <el-tab-pane label="客车险种" name="kreq"></el-tab-pane>
      <el-tab-pane label="货车险种" name="hreq"></el-tab-pane>
      <el-tab-pane label="特种车险种" name="treq"></el-tab-pane>
    </el-tabs>
    <el-form
      ref="form"
      class="form"
      :model="form[activeName]"
      :rules="rules"
      :col="1"
      label-width="250px"
    >
      <gv-collapse open-all disabled>
        <gv-collapse-item title="" name="1">
          <el-row slot="title" class="collapse-content nobottom">
            <el-form-item
              class="isOpenForceTitle"
              label="交强险 / 车船税"
              prop="isOpenForce"
              label-width="110px"
            >
              <gv-switch
                v-model="form[activeName].isOpenForce"
                optionType="whether"
                :disabled="isReadOnly"
              ></gv-switch>
            </el-form-item>
          </el-row>
          <el-row
            v-show="form[activeName].isOpenForce == 1"
            class="collapse-content"
          >
            <el-form-item prop="forceType" label-width="140px">
              <gv-radio-group
                v-model="form[activeName].forceType"
                optionType="ForceTypes"
                :disabled="isReadOnly"
                mode="col"
              ></gv-radio-group>
            </el-form-item>
          </el-row>
        </gv-collapse-item>
        <gv-collapse-item title="商业险" name="1">
          <el-row class="fieldTable">
            <el-table
              class="riskTable"
              :data="form[activeName].bizInsurances"
              empty-text="暂无商业险中，请添加"
            >
              <el-table-column prop="name" label="险种">
                <template #default="{ row, $index }">
                  <div
                    :class="[
                      'contentTitle',
                      'm-p',
                      'mr20',
                      { contentHover: !isReadOnly },
                    ]"
                  >
                    <div
                      class="title f-14 mb10"
                      @click="!isReadOnly && handleEdit(row, $index)"
                    >
                      {{ row.name }}
                    </div>
                    <div class="t-two f-12 c-7F7F7F">{{ row.description }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="defaultCheck" label="默认选中" width="200">
                <template #default="{ row }">
                  <el-select
                    v-model="row.defaultCheck"
                    placeholder="请选择"
                    :disabled="isReadOnly"
                  >
                    <el-option
                      v-for="item in row.supportAmounts"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="weight" label="序号" width="120">
              </el-table-column>
              <el-table-column prop="operation" label="操作" width="120">
                <template #default="{ $index }">
                  <el-button
                    class="txt-red-btn"
                    type="text"
                    @click="handleDel($index)"
                    :disabled="isReadOnly"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <gv-tree-tag
              v-show="!isReadOnly"
              class="mt10"
              ref="treeTag"
              urlType="RiskOption"
              placeholder="输入险种名称查找"
              node-key="id"
              v-model="checkeds[activeName]"
              :show-tag="false"
              @save="handleSave"
            >
              <template #reference>
                <el-button type="primary" icon="el-icon-plus"
                  >添加险种</el-button
                >
              </template>
            </gv-tree-tag>
          </el-row>
        </gv-collapse-item>
      </gv-collapse>
    </el-form>

    <gv-dialog title="编辑险种" :visible.sync="dialogVisible" width="600px">
      <div style="overflow: hidden">
        <gv-form
          ref="edit_form"
          class="form mt20"
          :model="edit_form"
          :rules="rules"
          :col="1"
          label-width="150px"
        >
          <gv-form-item keyName="险种名称" prop="name">
            <el-input
              v-model="edit_form.name"
              placeholder="输入险种名称"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="险种描述" prop="description">
            <el-input
              type="textarea"
              :rows="3"
              show-word-limit
              v-model="edit_form.description"
              placeholder="输入险种描述"
              maxlength="100"
              :disabled="isReadOnly"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="序号" prop="weight">
            <gv-input
              v-model="edit_form.weight"
              patternKey="PATTERN_POSITIVE_INTEGER"
              placeholder="输入序号"
            ></gv-input>
          </gv-form-item>
        </gv-form>
      </div>

      <el-row slot="footer" type="flex" justify="center">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSave">确 定</el-button>
      </el-row>
    </gv-dialog>
  </div>
</template>

<script>
import GvRadioGroup from "../../../../components/GvRadioGroup.vue";
import GvSwitch from "../../../../components/GvSwitch.vue";
export default {
  components: { GvSwitch, GvRadioGroup },
  name: "risk-form",
  props: {
    formData: {
      // 表单数据
      type: Object,
      default: () => {},
    },
    isReadOnly: {
      // 只读
      type: Boolean,
      default: () => true,
    },
  },
  data(vm) {
    return {
      activeName: "kreq",
      form: {
        kreq: {
          bizInsurances: [],
          isOpenForce: 0,
        },
        hreq: {
          bizInsurances: [],
        },
        treq: {
          bizInsurances: [],
        },
      },
      edit_form: {},
      editIndex: null,
      rules: {
        name: [
          { required: true, message: "请输入险种名称！", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入险种描述！", trigger: "blur" },
        ],
        weight: [{ required: true, message: "请输入序号！", trigger: "blur" }],
      },
      checkeds: {
        kreq: [],
        hreq: [],
        treq: [],
      },
      dialogVisible: false,
    };
  },
  methods: {
    // 获取表单数据
    getFormData() {
      return this.form;
    },
    // 删除
    handleDel(i) {
      this.form[this.activeName].bizInsurances.splice(i, 1);
      this.checkeds[this.activeName] = this.form[
        this.activeName
      ].bizInsurances.map((e) => e.id);
    },
    // 编辑
    handleEdit(row, i) {
      this.dialogVisible = true;
      this.editIndex = i;
      this.edit_form = JSON.parse(JSON.stringify(row));
    },
    // 编辑保存
    async handleEditSave() {
      let isok = await this.$refs.edit_form.validate();
      if (!isok) return;
      this.$set(
        this.form[this.activeName].bizInsurances,
        this.editIndex,
        this.edit_form
      );
      this.dialogVisible = false;
    },
    // 险种保存
    handleSave() {
      let checkeds = this.$refs.treeTag.getCheckedNodes();
      let list = this.form[this.activeName].bizInsurances || [];
      let l = [];
      checkeds.forEach((e) => {
        let obj = list.find((v) => v.id == e.id);
        if (obj) {
          l.push(obj);
        } else {
          l.push({
            ...e,
            weight: 1,
          });
        }
      });
      this.$set(this.form[this.activeName], "bizInsurances", l);
    },
    // table展开
    expandChange() {
      console.log(arguments);
    },
  },
  watch: {
    formData: {
      handler(val) {
        this.form = JSON.parse(JSON.stringify(val));
      },
      deep: true,
    },
  },
  computed: {},
  created() {},
};
</script>

<style lang='less' scoped>
.risk-content {
  padding: 0 15px;

  .rc_tabs {
    /deep/ .el-tabs__nav {
      transform: translateX(20px) !important;
    }
  }
  .isOpenForceTitle {
    /deep/ .el-form-item__label {
      color: #303133;
    }
  }
}
.collapse-content {
  max-width: 800px;
}
// .form {
//   .title {
//     font-size: 15px;
//     font-weight: 500;
//     padding: 15px 20px;
//   }
// }
.check_col {
  display: flex;
  flex-direction: column;
  label {
  }
}
.nobottom /deep/.el-form-item {
  margin-bottom: 5px;
}
.fieldTable {
  max-width: 1000px;
  padding-left: 30px;
}
.contentTitle {
  .title {
    color: #515a6e;
    font-weight: 500;
  }
}
.contentHover {
  &:hover {
    .title {
      &:after {
        content: "";
        display: inline-block;
        width: 15px;
        height: 15px;
        background: url("../../../../assets/images/edit.png") no-repeat top left /
          15px 15px;
        margin-left: 10px;
      }
    }
  }
}
</style>