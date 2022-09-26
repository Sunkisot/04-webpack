<template>
  <gv-dialog title="机构充值" :visible.sync="visible" width="700px">
    <gv-form
      ref="form"
      class="form"
      :model="form"
      :rules="rules"
      :col="1"
      label-width="200px"
    >
      <el-row class="collapse-content">
        <gv-form-item keyName="账户可用余额" prop="balance">
          {{ form.balance | money(true, 2) }} 元
        </gv-form-item>
        <gv-form-item keyName="充值金额" prop="amount">
          <gv-input
            v-model="form.amount"
            placeholder="输入充值金额"
            maxlength="12"
            :thou="true"
            numLen="2"
            :disabled="isReadOnly"
          >
            <template #suffix>
              <span>元</span>
            </template>
          </gv-input>
        </gv-form-item>
        <gv-form-item keyName="机构到期时间" prop="maturityTime">
          {{ form.maturityTime ? gvUtil.dateToStr(form.maturityTime, "yyyy-MM-dd HH:mm:ss") : '--'}}
        </gv-form-item>
        <gv-form-item keyName="机构续签到期日" prop="expireTime">
          <gv-date-picker
            v-model="form.expireTime"
            desabledBefore
            placeholder="请选择机构续签到期日"
          ></gv-date-picker>
        </gv-form-item>
        <gv-form-item keyName="充值 / 续签备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            show-word-limit
            v-model="form.remark"
            placeholder="输入备注"
            maxlength="500"
            :disabled="isReadOnly"
          ></el-input>
        </gv-form-item>
      </el-row>
    </gv-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">保 存</el-button>
    </el-row>
  </gv-dialog>
</template>

<script>
import { getRechargeDetail, postRecharge } from "@/api/orgManage";
export default {
  name: "charge-dialog",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    saveBack: Function
  },
  data(vm) {
    return {
      mechanismId: null, // 机构id
      isReadOnly: false,
      visible: false,
      form: {
        balance: 0,
      },
      rules: {},
    };
  },
  methods: {
    // 获取表单数据
    async getFormData() {
      let isok = await this.$refs.form.validate();
      return isok ? this.form : null;
    },
    // 保存
    async handleSave() {
      if (
        !(this.form.amount || this.form.amount == 0 || this.form.expireTime)
      ) {
        this.$message.warning("充值金额或机构续签到期日不能为空！");
        return;
      }
      let res = await postRecharge({
        ...this.form,
        expireTime: this.form.expireTime ? this.form.expireTime + " 23:59:59" : '',
        mechanismId: this.mechanismId,
      });
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.visible = false;
        typeof this.saveBack == 'function' && this.saveBack()
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 获取充值详情
    async initDetail(id) {
      this.mechanismId = id;
      let res = await getRechargeDetail(id);
      if (res && res.code == "00000") {
        this.form = Object.assign({}, res.data || this.form);
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 初始化组件
    initComponent(id) {
      this.initDetail(id);
    },
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  created() {},
};
</script>

<style lang='less' scoped>
.collapse-content {
  max-width: 800px;
}
</style>