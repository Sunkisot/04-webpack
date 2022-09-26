<template>
  <gv-form
    ref="form"
    class="form"
    :model="form"
    :rules="rules"
    :col="1"
    label-width="250px"
  >
    <el-row class="collapse-content">
      <gv-form-item keyName="影像上传顺序" prop="imageUploadNo">
        <gv-radio-group
          v-model="form.imageUploadNo"
          optionType="QuotaReferPositions"
          :disabled="isReadOnly"
        ></gv-radio-group>
      </gv-form-item>
      <gv-form-item keyName="修改商业险折扣系数" prop="updateVCIDiscountCoefficient">
        <gv-switch
          v-model="form.updateVCIDiscountCoefficient"
          tip_txt="开启后客户端报价时，可编辑商业险折扣系数。"
          :disabled="isReadOnly"
        >
        </gv-switch>
      </gv-form-item>
      <gv-form-item keyName="修改车损保额" prop="updateVehicleDamageInsuredAmount">
        <gv-switch
          v-model="form.updateVehicleDamageInsuredAmount"
          tip_txt="开启后客户端报价时，可编辑车损保额。"
          :disabled="isReadOnly"
        >
        </gv-switch>
      </gv-form-item>
      <gv-form-item keyName="显示跟单费率" prop="showDocumentaryRate">
        <gv-switch
          v-model="form.showDocumentaryRate"
          tip_txt="开启后客户端、后台可查看跟单费率，并且可支持修改跟单费率。"
          :disabled="isReadOnly"
        >
        </gv-switch>
      </gv-form-item>
      <gv-form-item v-if="form.showDocumentaryRate == 1" prop="updateDocumentaryRate">
        <gv-radio-group
          v-model="form.updateDocumentaryRate"
          optionType="ReviseRateStatus"
          :disabled="isReadOnly"
          mode="col"
        ></gv-radio-group>
      </gv-form-item>
      <gv-form-item keyName="投保短信验证" prop="insureMessageValid">
        <gv-radio-group
          v-model="form.insureMessageValid"
          optionType="SMSValidStatus"
          :disabled="isReadOnly"
          mode="col"
        ></gv-radio-group>
      </gv-form-item>
      <gv-form-item keyName="发票及交付方式" prop="invoiceDeliverType">
        <gv-checkbox-group
          v-model="form.invoiceDeliverType"
          optionType="InvoiceFormat"
          mode="col"
          :disabled="isReadOnly"
        >
        </gv-checkbox-group>
      </gv-form-item>
      <gv-form-item keyName="交强险保单交付方式" prop="tciDeliverType"> 
        <gv-checkbox-group
          v-model="form.tciDeliverType"
          optionType="InvoiceFormat"
          mode="col"
          :disabled="isReadOnly"
        >
        </gv-checkbox-group>
      </gv-form-item>
      <gv-form-item keyName="商业险保单交付方式" prop="vciDeliverType">
        <gv-checkbox-group
          v-model="form.vciDeliverType"
          optionType="InvoiceFormat"
          mode="col"
          :disabled="isReadOnly"
        >
        </gv-checkbox-group>
      </gv-form-item>
      <gv-form-item keyName="设置跟单及渠道" prop="setDocumentaryChannel">
        <gv-switch
          v-model="form.setDocumentaryChannel"
          :disabled="isReadOnly"
        >
        </gv-switch>
      </gv-form-item>
      <gv-form-item keyName="实名制缴费" prop="realNamePay">
        <gv-switch
          v-model="form.realNamePay"
          :disabled="isReadOnly"
        >
        </gv-switch>
      </gv-form-item>
    </el-row>
  </gv-form>
</template>

<script>
export default {
  name: "area-form",
  props: {
    formData: {
      // 表单数据
      type: Object,
      default: () => {},
    },
    isReadOnly: {
      // 只读
      type: Boolean,
      default: () => false,
    },
  },
  data(vm) {
    return {
      form: {
        invoiceDeliverType: [],
        tciDeliverType: [],
        vciDeliverType: []
      },
      rules: {
      },
    };
  },
  methods: {
    // 获取表单数据
    async getFormData() {
      let isok = await this.$refs.form.validate();
      return isok ? this.form : null;
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
.collapse-content {
  max-width: 800px;
  margin-top: 10px;
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
</style>