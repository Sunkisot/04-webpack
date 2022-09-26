<template>
  <gv-collapse class="gv-collapse" open-all disabled>
    <gv-form
      ref="form"
      class="form"
      :model="form"
      :rules="rules"
      :col="1"
      label-width="250px"
    >
      <gv-collapse-item title="支付方式" name="2">
        <el-row class="collapse-content">
          <gv-form-item keyName="直付到保险公司" prop="isDirectPay">
            <gv-switch
              v-model="form.isDirectPay"
              :disabled="isReadOnly"
            ></gv-switch>
          </gv-form-item>
          <gv-form-item
            keyName="客户端支付方式"
            prop="clientPayWay"
          >
            <gv-checkbox-group
              v-model="form.clientPayWay"
              optionType="ClientPayWay"
              :disabled="isReadOnly || form.isDirectPay == 0"
            >
            </gv-checkbox-group>
          </gv-form-item>
          <gv-form-item
            keyName="备注"
            prop="clientPayWayRemark"
          >
            <el-input
              type="textarea"
              :rows="3"
              show-word-limit
              v-model="form.clientPayWayRemark"
              placeholder="输入备注"
              maxlength="500"
              :disabled="isReadOnly || form.isDirectPay == 0"
            ></el-input>
          </gv-form-item>
          <gv-form-item
            keyName="后台订单支付方式"
            prop="adminPayWay"
          >
            <gv-checkbox-group
              v-model="form.adminPayWay"
              optionType="ClientPayWay"
              :disabled="isReadOnly || form.isDirectPay == 0"
            >
            </gv-checkbox-group>
          </gv-form-item>
          <gv-form-item keyName="线下支付" prop="isSupportOfflinePay">
            <gv-switch
              v-model="form.isSupportOfflinePay"
              :disabled="isReadOnly"
            ></gv-switch>
          </gv-form-item>
          <gv-form-item
            keyName="备注"
            prop="adminPayWayRemark"
          >
            <el-input
              type="textarea"
              :rows="3"
              show-word-limit
              v-model="form.adminPayWayRemark"
              placeholder="输入备注"
              maxlength="500"
              :disabled="isReadOnly || form.isDirectPay == 0"
            ></el-input>
          </gv-form-item>
          
        </el-row>
      </gv-collapse-item>
    </gv-form>
  </gv-collapse>
</template>

<script>
export default {
  name: "pay-from",
  components: {
  },
  props: {
    form: {
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
      rules: {},
    };
  },
  methods: {
    // 获取表单数据
    validate() {
      return this.$refs.form.validate();
    },
    // 删除
    handleDel(i) {
      this.form.orderPhotos.splice(i, 1);
    },
  },
  watch: {},
  computed: {},
  created() {},
};
</script>

<style lang='less' scoped>
.collapse-content {
  max-width: 800px;
}
.orderTable {
  padding-left: 40px;
  max-width: 1000px;
  padding-bottom: 20px;
  border-bottom: 1px solid #d9d9d9;
}
.failTable {
  padding-left: 40px;
  max-width: 1000px;
  padding-bottom: 20px;
}
.form {
  .title {
    font-size: 15px;
    font-weight: 500;
    padding: 15px 20px;
  }
}

.gv-collapse {
  border-top: 1px solid #e6ebf5;
}
</style>