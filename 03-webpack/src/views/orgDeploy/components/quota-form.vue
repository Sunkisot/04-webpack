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
      <gv-collapse-item name="2">
        <template #title>
          <span>报价信息配置</span>
          <span class="f-12 c-7F7F7F"
            >（配置机构保险公司报价时需要填写的信息）</span
          >
        </template>
        <el-row class="collapse-content">
          <gv-form-item keyName="投保人信息" prop="quotaPolicyInfo">
            <tp-info-select
              v-model="form.quotaPolicyInfo"
              prop="applicant"
              type="quote"
              :disabled="isReadOnly"
            ></tp-info-select>
          </gv-form-item>
          <gv-form-item keyName="被保人信息" prop="quotaInsuranceInfo">
            <tp-info-select
              v-model="form.quotaInsuranceInfo"
              prop="insurant"
              type="quote"
              :disabled="isReadOnly"
            ></tp-info-select>
          </gv-form-item>
          <gv-form-item keyName="车主信息" prop="quotaVehicleInfo">
            <tp-info-select
              v-model="form.quotaVehicleInfo"
              prop="owner"
              type="quote"
              :disabled="isReadOnly"
            ></tp-info-select>
          </gv-form-item>
          <gv-form-item keyName="其它信息" prop="quotaOtherInfo">
            <tp-info-select
              v-model="form.quotaOtherInfo"
              prop="other"
              type="quote"
              :disabled="isReadOnly"
            ></tp-info-select>
          </gv-form-item>
        </el-row>
      </gv-collapse-item>
      <gv-collapse-item name="3">
        <template #title>
          <span>提交订单信息配置</span>
          <span class="f-12 c-7F7F7F"
            >（配置机构保险公司提交订单时需要填写的信息）</span
          >
        </template>
        <el-row class="collapse-content">
          <gv-form-item keyName="投保人信息" prop="orderPolicyInfo">
            <tp-info-select
              v-model="form.orderPolicyInfo"
              prop="applicant"
              type="order"
              :disabled="isReadOnly"
            ></tp-info-select>
          </gv-form-item>
          <gv-form-item keyName="被保人信息" prop="orderInsuranceInfo">
            <tp-info-select
              v-model="form.orderInsuranceInfo"
              prop="insurant"
              type="order"
              :disabled="isReadOnly"
            ></tp-info-select>
          </gv-form-item>
          <gv-form-item keyName="车主信息" prop="orderVehicleInfo">
            <tp-info-select
              v-model="form.orderVehicleInfo"
              prop="owner"
              type="order"
              :disabled="isReadOnly"
            ></tp-info-select>
          </gv-form-item>
          <gv-form-item keyName="其它信息" prop="orderOtherInfo">
            <tp-info-select
              v-model="form.orderOtherInfo"
              prop="other"
              type="order"
              :disabled="isReadOnly"
            ></tp-info-select>
          </gv-form-item>
        </el-row>
      </gv-collapse-item>
      <gv-collapse-item title="其他配置" name="4">
        <el-row class="collapse-content">
          <gv-form-item
            keyName="客户端是否显示特别约定"
            prop="isShowSpecialProvide"
          >
            <gv-radio-group
              v-model="form.isShowSpecialProvide"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="发票交付方式" prop="invoiceMaterial">
            <gv-radio-group
              v-model="form.invoiceMaterial"
              :options="
                gvUtil.options.InvoiceMaterial.filter((e) =>
                  areaDeploy.invoiceDeliverType.includes(e.code)
                )
              "
              :defaultValue="
                areaDeploy.invoiceDeliverType.length == 1
                  ? areaDeploy.invoiceDeliverType[0]
                  : areaDeploy.invoiceDeliverType[1]
              "
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="交强险保单交付方式" prop="forcePolicyMaterial">
            <gv-radio-group
              v-model="form.forcePolicyMaterial"
              :options="
                gvUtil.options.InvoiceMaterial.filter((e) =>
                  areaDeploy.tciDeliverType.includes(e.code)
                )
              "
              :defaultValue="
                areaDeploy.tciDeliverType.length == 1
                  ? areaDeploy.tciDeliverType[0]
                  : areaDeploy.tciDeliverType[1]
              "
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="商业险保单交付方式" prop="bizPolicyMaterial">
            <gv-radio-group
              v-model="form.bizPolicyMaterial"
              :options="
                gvUtil.options.InvoiceMaterial.filter((e) =>
                  areaDeploy.vciDeliverType.includes(e.code)
                )
              "
              :defaultValue="
                areaDeploy.vciDeliverType.length == 1
                  ? areaDeploy.vciDeliverType[0]
                  : areaDeploy.vciDeliverType[1]
              "
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="电子保单是否支持配送" prop="isEpolicyDelivery">
            <gv-radio-group
              v-model="form.isEpolicyDelivery"
              optionType="Supports"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item
            class="nobottom"
            keyName="保单/发票配送方式"
            prop="deliveryFieldsFlag"
          >
            <gv-checkbox-group
              v-model="form.deliveryFieldsFlag"
              optionType="DeliveryFields"
              :disabled="isReadOnly"
            >
            </gv-checkbox-group>
          </gv-form-item>
          <gv-form-item prop="defaultDeliveryFieldsFlag">
            <gv-select
              v-model="form.defaultDeliveryFieldsFlag"
              optionType="DeliveryFields"
              :disabled="isReadOnly"
              placeholder="请选择默认配送方式"
            >
            </gv-select>
          </gv-form-item>
          <gv-form-item
            keyName="客户端是否可发送身份证验证码"
            prop="isSendIdCode"
          >
            <gv-radio-group
              v-model="form.isSendIdCode"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="发送电子投保单">
            <div class="flex-col">
              <gv-checkbox v-model="form.isClientSupportEproposal" :disabled="isReadOnly"
                >客户端发送电子投保单</gv-checkbox
              >
              <gv-checkbox v-model="form.isAdminSupportEproposal" :disabled="isReadOnly"
                >后台订单发送电子投保单</gv-checkbox
              >
            </div>
          </gv-form-item>
          <gv-form-item keyName="修改验车情况">
            <div class="flex-col">
              <gv-checkbox v-model="form.isClientSupportValidateCar" :disabled="isReadOnly"
                >客户端修改验车情况</gv-checkbox
              >
              <gv-checkbox v-model="form.isH5SupportValidateCar" :disabled="isReadOnly"
                >H5报价出单修改验车情况</gv-checkbox
              >
            </div>
          </gv-form-item>
          <gv-form-item keyName="修改折扣系数" prop="isCanModifyDiscount">
            <gv-radio-group
              v-model="form.isCanModifyDiscount"
              :options="
                gvUtil.options.Supports.filter(
                  (e) => areaDeploy.updateVCIDiscountCoefficient == e.code
                )
              "
              :defaultValue="areaDeploy.updateVCIDiscountCoefficient"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="修改车损保额" prop="isAllowModifyDamageAmount">
             <gv-radio-group
              v-model="form.isAllowModifyDamageAmount"
              :options="
                gvUtil.options.Supports.filter(
                  (e) => areaDeploy.updateVehicleDamageInsuredAmount == e.code
                )
              "
              :defaultValue="areaDeploy.updateVehicleDamageInsuredAmount"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item
            keyName="支付二维码备注"
            prop="qrcodeRemark"
            class="nobottom"
          >
            <el-input
              v-model="form.qrcodeRemark"
              placeholder="输入二维码支付备注"
              maxlength="200"
              :disabled="isReadOnly"
            ></el-input>
          </gv-form-item>
          <gv-form-item prop="isSupportQrcodeRefresh" class="nobottom">
            <gv-checkbox v-model="form.isSupportQrcodeRefresh"
              >支持刷新支付二维码</gv-checkbox
            >
          </gv-form-item>
          <gv-form-item keyName="私家车服务包" prop="vehicleService">
            <gv-radio-group
              v-model="form.vehicleService"
              optionType="VehicleService"
              mode="col"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item
            keyName="显示支付成功刷新按钮"
            prop="isShowRefreshButton"
          >
            <gv-radio-group
              v-model="form.isShowRefreshButton"
              optionType="DisplayStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
        </el-row>
      </gv-collapse-item>
    </gv-form>
  </gv-collapse>
</template>

<script>
import tpInfoSelect from "./info-select.vue";
export default {
  name: "quota-form",
  components: {
    tpInfoSelect,
  },
  props: {
    form: {
      // 表单数据
      type: Object,
      default: () => {},
    },
    areaDeploy: {
      // 区域化配置
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
        ics: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入机构编码", trigger: "blur" }],
        type: [
          { required: true, message: "请选择机构类型", trigger: "change" },
        ],
        simpleName: [
          { required: true, message: "请输入机构简称", trigger: "blur" },
        ],
        regionCode: [
          { required: true, message: "请选择机构所在地区", trigger: "blur" },
        ],
      },
      checked: false,
    };
  },
  methods: {
    // 获取表单数据
    validate() {
      return this.$refs.form.validate();
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