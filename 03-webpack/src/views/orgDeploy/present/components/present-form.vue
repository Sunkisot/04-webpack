<template>
  <div>
    <gv-collapse open-all disabled>
      <gv-collapse-item title="赠送内容" name="1">
        <el-row class="collapse-content">
          <el-table
            :data="tableData"
            empty-text="暂无赠送内容，请添加"
            style="width: 100%"
          >
            <el-table-column prop="content" label="赠送内容" width="180">
            </el-table-column>
            <el-table-column prop="validPeriod" label="有效期" width="180">
              <template #default="{ row }">
                {{
                  row.validPeriod != "CUSTOM"
                    ? gvUtil.translateOption("ValidPeriod", row.validPeriod)
                    : gvUtil.dateToStr(row.startTime, "yyyy-MM-dd") +
                      "至" +
                      gvUtil.dateToStr(row.endTime, "yyyy-MM-dd")
                }}
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.remark || "--" }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="{ row, $index }">
                <el-button
                  type="text"
                  @click="handleEdit(row, $index)"
                  :disabled="isReadOnly"
                  >编辑</el-button
                >
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
          <el-button
            v-if="!isReadOnly"
            class="mt10"
            type="primary"
            @click="handleAdd"
            >添加一条赠送内容</el-button
          >
        </el-row>
      </gv-collapse-item>
    </gv-collapse>

    <gv-dialog
      :title="pageType == 'add' ? '添加赠送内容' : '编辑赠送内容'"
      :visible.sync="visible"
      width="650px"
    >
      <gv-form
        ref="form"
        class="form"
        :model="form"
        :rules="rules"
        :col="1"
        label-width="150px"
      >
        <gv-form-item keyName="赠送内容" prop="content">
          <el-input
            v-model="form.content"
            placeholder="输入赠送内容"
            maxlength="30"
          ></el-input>
        </gv-form-item>
        <gv-form-item keyName="有效期" prop="validPeriod">
          <el-radio-group class="colRadio" v-model="form.validPeriod" @change="validPeriodChange">
            <el-radio label="POLICY">保单生效日起一年内</el-radio>
            <el-radio label="TODAY">即日起一年内</el-radio>
            <el-radio label="CUSTOM"
              >自定义有效期
              <div class="datePicker">
                <el-form-item prop="startTime">
                  <gv-date-picker
                    v-model="form.startTime"
                    rangeType="start"
                    placeholder="选择日期"
                    :timeLimit="form.endTime"
                    :disabled="form.validPeriod != 'CUSTOM'"
                    desabledBefore
                  >
                  </gv-date-picker>
                </el-form-item>
                至
                <el-form-item prop="endTime">
                  <gv-date-picker
                    v-model="form.endTime"
                    rangeType="end"
                    placeholder="选择日期"
                    :timeLimit="form.startTime"
                    :disabled="form.validPeriod != 'CUSTOM'"
                    desabledBefore
                  >
                  </gv-date-picker>
                </el-form-item>
              </div>
            </el-radio>
          </el-radio-group>
        </gv-form-item>
        <gv-form-item keyName="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            show-word-limit
            v-model="form.remark"
            placeholder="输入备注"
            maxlength="500"
          ></el-input>
        </gv-form-item>
      </gv-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </el-row>
    </gv-dialog>
  </div>
</template>

<script>
export default {
  name: "present-form",
  components: {},
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
      tableData: [],
      pageType: "add",
      editIndex: null, // 编辑的index
      visible: false,
      initForm: {
        validPeriod: "POLICY",
      },
      form: {},
      rules: {
        content: [
          { required: true, message: "请输入赠送内容！", trigger: "blur" },
        ],
        validPeriod: [{ required: true, trigger: "blur" }],
      },
    };
  },
  methods: {
    // 有效期change
    validPeriodChange(e) {
      console.log(e)
      if(e == 'CUSTOM') {
        this.rules.startTime = [{ required: true, message: "起始日期不能为空！", trigger: "blur" }]
        this.rules.endTime = [{ required: true, message: "截止日期不能为空！", trigger: "blur" }]
      }else {
        this.rules.startTime = null
        this.rules.endTime = null
        this.$refs.form.clearValidate(['startTime', 'endTime'])
      }
    },
    // 获取表单数据
    getTableData() {
      return this.tableData;
    },
    // 编辑
    handleEdit(row, i) {
      this.pageType = "edit";
      this.editIndex = i;
      this.visible = true;
      this.form = JSON.parse(JSON.stringify(row));
    },
    // 添加
    handleAdd() {
      this.pageType = "add";
      this.visible = true;
      this.form = { ...this.initForm, mechanismId: this.formData.mechanismId };
    },
    // 保存
    async handleSave() {
      let isok = await this.$refs.form.validate();
      if (!isok) return;
      if (this.pageType == "add") {
        this.tableData.push(this.form);
      } else {
        this.$set(this.tableData, this.editIndex, this.form);
        console.log(this.tableData);
      }
      this.visible = false;
    },
    // 删除
    handleDel(i) {
      this.tableData.splice(i, 1);
    },
  },
  watch: {
    "formData.giveAways": {
      handler(val) {
        this.tableData = JSON.parse(JSON.stringify(val));
      },
      deep: true,
    },
  },
  computed: {},
  created() {},
};
</script>

<style lang='less' scoped>
.collapse-content {
  padding: 0 20px;
}
.form {
  overflow: hidden;
  margin-top: 20px;
}
.colRadio {
  display: flex;
  flex-direction: column;
  label {
    margin: 10px 0;
    display: flex;
    align-items: center;
    /deep/.el-radio__label {
      display: flex;
      align-items: center;
    }
    &:last-child {
      margin: 0;
    }
  }
}
.datePicker {
  width: 200px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  .date-picker {
    width: 140px;
    /deep/ .el-input__inner {
      width: 100%;
    }
  }
}
</style>