<template>
  <gv-form
    ref="form"
    class="form"
    :model="formData"
    :rules="rules"
    :col="1"
    label-width="250px"
  >
    <gv-collapse open-all disabled>
      <gv-collapse-item title="短信配置" name="1">
        <el-row class="collapse-content">
          <gv-form-item keyName="短信通道" prop="smsServiceProvider">
            <gv-radio-group
              v-model="formData.smsServiceProvider"
              optionType="SMSAisle"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="短信模版ID" prop="smsTemplateId">
            <gv-input
              v-model="formData.smsTemplateId"
              patternKey='PATTERN_ORDERNO'
              :disabled="isReadOnly"
              placeholder="请输入短信模版ID"
            ></gv-input>
          </gv-form-item>
          <gv-form-item
            keyName="短信主险保费"
            prop="smsPrimaryInsurancePremium"
          >
            <gv-radio-group
              v-model="formData.smsPrimaryInsurancePremium"
              optionType="ContainStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="不计免陪" prop="noDeductible">
            <gv-radio-group
              v-model="formData.noDeductible"
              optionType="ContainStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="截止日期" prop="deadline">
            <gv-radio-group
              v-model="formData.deadline"
              optionType="ContainStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="盗抢险&司乘险的顺序" prop="dqxAndScxNo">
            <gv-radio-group
              v-model="formData.dqxAndScxNo"
              optionType="ChangeStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="详情链接" prop="detailUrl">
            <gv-radio-group
              v-model="formData.detailUrl"
              optionType="ContainStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="后台分享显示二维码" prop="showShareQrCode">
            <gv-radio-group
              v-model="formData.showShareQrCode"
              optionType="DisplayStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="按照净保费优惠" prop="netPremiumDiscount">
            <gv-radio-group
              v-model="formData.netPremiumDiscount"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="商业险折扣率" prop="ciDiscountRate">
            <gv-radio-group
              v-model="formData.ciDiscountRate"
              optionType="ContainStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item
            class="nobottom"
            keyName="报价前缀"
            prop="quotedPricePrefix"
          >
            <gv-radio-group
              v-model="formData.quotedPricePrefix"
              optionType="QuotaPrefix"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item
            v-if="formData.quotedPricePrefix == 0"
            prop="quotedPricePrefixText"
          >
            <gv-input
              v-model="formData.quotedPricePrefixText"
              :disabled="isReadOnly"
              placeholder="输入报价前缀"
            ></gv-input>
          </gv-form-item>
          <gv-form-item keyName="金额取整" prop="amountRoundNumber">
            <el-radio-group
              class="colRadio"
              v-model="formData.amountRoundNumber"
              :disabled="isReadOnly"
            >
              <el-radio :label="0">不取整</el-radio>
              <el-radio :label="1">实缴保费取整</el-radio>
              <gv-radio-group
                v-if="formData.amountRoundNumber == 1"
                class="ml20"
                v-model="formData.amountRoundNumberType"
                optionType="IntMoneyRules"
                :disabled="isReadOnly"
                mode="col"
              ></gv-radio-group>
              <el-radio :label="2">优惠金额取整</el-radio>
              <gv-radio-group
                v-if="formData.amountRoundNumber == 2"
                class="ml20"
                v-model="formData.amountRoundNumberType"
                optionType="IntMoneyRules"
                :disabled="isReadOnly"
                mode="col"
              ></gv-radio-group>
            </el-radio-group>
          </gv-form-item>
        </el-row>
      </gv-collapse-item>
    </gv-collapse>
  </gv-form>
</template>

<script>
export default {
  name: "sms-form",
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
      rules: {
        smsTemplateId: [{ required: true, message: "请输入短信模版ID", trigger: "blur" }],
      },
      checked: false,
    };
  },
  methods: {
    // 获取表单数据
    async validate() {
      return await this.$refs.form.validate();
    },
  },
  watch: {
    // formData: {
    //   handler(val) {
    //     this.form = JSON.parse(JSON.stringify(val));
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  computed: {},
  created() {},
};
</script>

<style lang='less' scoped>
.collapse-content {
  max-width: 800px;
}
.form {
  .title {
    font-size: 15px;
    font-weight: 500;
    padding: 15px 20px;
  }
}
.check_col {
  display: flex;
  flex-direction: column;
  label {
  }
}
.nobottom /deep/.el-form-item {
  margin-bottom: 5px;
}
.colRadio {
  display: flex;
  flex-direction: column;
  label {
    margin: 10px 0;
  }
}
</style>