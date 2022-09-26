<template>
  <gv-form
    ref="form"
    class="form"
    :model="form"
    :rules="rules"
    :col="1"
    label-width="250px"
  >
    <gv-collapse open-all disabled>
      <gv-collapse-item title="系统功能配置" name="1">
        <el-row class="collapse-content">
          <gv-form-item keyName="单点登录">
            <div class="flex-col">
              <gv-checkbox v-model="form.isClientSso" :disabled="isReadOnly"
                >客户端单点登录</gv-checkbox
              >
              <gv-checkbox v-model="form.isAdminSso" :disabled="isReadOnly"
                >管理后台单点登录</gv-checkbox
              >
            </div>
          </gv-form-item>
          <gv-form-item keyName="客户端支持切换机构" prop="isSupportSwitch">
            <gv-radio-group
              v-model="form.isSupportSwitch"
              optionType="Supports"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="优豆功能" prop="isOpenCredit">
            <gv-radio-group
              v-model="form.isOpenCredit"
              optionType="OpenStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="客户信息加密" prop="isEncrypt">
            <gv-radio-group
              v-model="form.isEncrypt"
              optionType="OpenStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="增加水印" prop="watermark">
            <gv-radio-group
              v-model="form.watermark"
              optionType="WaterMarks"
              :disabled="isReadOnly"
              mode="col"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="是否显示公司消息" prop="isShowCompany">
            <gv-radio-group
              v-model="form.isShowCompany"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="后台已删除订单" prop="isShowDeleted">
            <gv-radio-group
              v-model="form.isShowDeleted"
              optionType="showStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="订单批单" prop="isOpenApprove">
            <gv-radio-group
              v-model="form.isOpenApprove"
              optionType="OpenStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="订单审核机构" prop="approveMechanism">
            <gv-radio-group
              v-model="form.approveMechanism"
              optionType="OrderAuditOrgs"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="可承保车牌" prop="supportPlate">
            <add-lpr
              v-model="form.supportPlate"
              :disabled="isReadOnly"
              tip_txt="请输入可承保的车牌，格式为地区A；例如 京A／粤A"
            ></add-lpr>
          </gv-form-item>
        </el-row>
      </gv-collapse-item>
      <gv-collapse-item title="智能报价功能配置" name="2">
        <el-row class="collapse-content">
          <gv-form-item keyName="查询车辆方式">
            <div class="check_col">
              <gv-checkbox v-model="form.isOpenQueryPlate" disabled
                >车牌号</gv-checkbox
              >
              <gv-checkbox
                class="ml20"
                v-model="form.isNeedIdCard"
                :disabled="isReadOnly"
                >需要车主证件号</gv-checkbox
              >
              <gv-checkbox v-model="form.isOpenQueryVin" :disabled="isReadOnly"
                >车架号</gv-checkbox
              >
              <gv-checkbox
                v-model="form.isOpenQueryPolicy"
                :disabled="isReadOnly"
                >保单号</gv-checkbox
              >
            </div>
          </gv-form-item>
          <gv-form-item class="nobottom" keyName="查询车型方式" prop="queryWay">
            <gv-checkbox-group
              class="nobottom"
              v-model="form.queryWay"
              optionType="DefaultQuery"
              :disabled="isReadOnly"
              mode="col"
            >
            </gv-checkbox-group>
          </gv-form-item>
          <gv-form-item>
            <el-form-item label="选择默认查询方式" label-width="140px">
              <gv-select
                style="width: 200px"
                optionType="DefaultQuery"
                placeholder="请选择"
                :disabled="isReadOnly"
                v-model="form.defaultQuery"
              ></gv-select>
            </el-form-item>
          </gv-form-item>
          <gv-form-item keyName="最多选择几家保险公司报价" prop="maxQuotaIc">
            <gv-input
              v-model="form.maxQuotaIc"
              placeholder="请输入业务员报价时最多可选的保险公司数量"
              maxlength="12"
              :thou="true"
              numLen="0"
              :disabled="isReadOnly"
            >
              <template #suffix>
                <span> 家 </span>
              </template>
            </gv-input>
          </gv-form-item>
          <gv-form-item keyName="暂存到保险公司" prop="isOpenTemp">
            <gv-radio-group
              v-model="form.isOpenTemp"
              optionType="OpenStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="是否显示跟单费用" prop="isShowCost">
            <gv-radio-group
              v-model="form.isShowCost"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item
            class="nobottom"
            keyName="是否支持分享报价"
            prop="isShareQuota"
          >
            <gv-radio-group
              v-model="form.isShareQuota"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item>
            <div class="check_col ml20">
              <gv-checkbox
                :value="form.bizDiscountType ? 1 : 0"
                :disabled="isReadOnly"
                @select="selectChange($event, 'bizDiscountType')"
                >商业险优惠</gv-checkbox
              >
              <el-radio-group
                v-show="form.bizDiscountType"
                class="check_col ml20"
                v-model="form.bizDiscountType"
              >
                <el-radio class="mb10" label="MANUAL"
                  >手动配置优惠范围
                  <gv-input
                    style="width: 100px"
                    v-model="form.bizManualRange[0]"
                    patternKey="Hundred"
                    maxlength="3"
                    :disabled="isReadOnly || form.bizDiscountType != 'MANUAL'"
                  >
                    <template #suffix>
                      <span>%</span>
                    </template>
                  </gv-input>
                  至
                  <gv-input
                    style="width: 100px"
                    v-model="form.bizManualRange[1]"
                    patternKey="Hundred"
                    maxlength="3"
                    :disabled="isReadOnly || form.bizDiscountType != 'MANUAL'"
                  >
                    <template #suffix>
                      <span>%</span>
                    </template>
                  </gv-input>
                </el-radio>
                <el-radio label="AUTO"
                  >自动配置优惠范围（目前仅支持国寿车险）号后四位</el-radio
                >
              </el-radio-group>
              <gv-checkbox
                :value="form.forceDiscountType ? 1 : 0"
                :disabled="isReadOnly"
                @select="selectChange($event, 'forceDiscountType')"
                >交强险优惠</gv-checkbox
              >
              <el-radio-group
                v-show="form.forceDiscountType"
                class="check_col ml20"
                v-model="form.forceDiscountType"
              >
                <el-radio class="mb10" label="MANUAL"
                  >手动配置优惠范围
                  <gv-input
                    style="width: 100px"
                    v-model="form.forceManualRange[0]"
                    patternKey="Hundred"
                    maxlength="3"
                    :disabled="isReadOnly || form.forceDiscountType != 'MANUAL'"
                  >
                    <template #suffix>
                      <span>%</span>
                    </template>
                  </gv-input>
                  至
                  <gv-input
                    style="width: 100px"
                    v-model="form.forceManualRange[1]"
                    patternKey="Hundred"
                    maxlength="3"
                    :disabled="isReadOnly || form.forceDiscountType != 'MANUAL'"
                  >
                    <template #suffix>
                      <span>%</span>
                    </template>
                  </gv-input>
                </el-radio>
                <el-radio label="AUTO"
                  >自动配置优惠范围（目前仅支持国寿车险）号后四位</el-radio
                >
              </el-radio-group>
              <gv-checkbox
                :value="form.taxDiscountType ? 1 : 0"
                :disabled="isReadOnly"
                >车船税优惠
                <gv-input
                  style="width: 100px"
                  v-model="form.taxManualRange[0]"
                  patternKey="Hundred"
                  maxlength="3"
                  :disabled="isReadOnly || form.taxDiscountType != 1"
                >
                  <template #suffix>
                    <span>%</span>
                  </template>
                </gv-input>
                至
                <gv-input
                  style="width: 100px"
                  v-model="form.taxManualRange[1]"
                  patternKey="Hundred"
                  maxlength="3"
                  :disabled="isReadOnly || form.taxDiscountType != 1"
                >
                  <template #suffix>
                    <span>%</span>
                  </template>
                </gv-input></gv-checkbox
              >
            </div>
          </gv-form-item>
          <gv-form-item keyName="报价参考提醒位置">
            <div class="flex-col">
              <gv-checkbox v-model="form.isRemindBefore" :disabled="isReadOnly"
                >核保前</gv-checkbox
              >
              <gv-checkbox v-model="form.isRemindAfter" :disabled="isReadOnly"
                >核保后</gv-checkbox
              >
            </div>
          </gv-form-item>
          <gv-form-item keyName="是否显示出单/报价账号" prop="isShowAccount">
            <gv-radio-group
              v-model="form.isShowAccount"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
        </el-row>
      </gv-collapse-item>
      <gv-collapse-item title="订单功能配置" name="2">
        <el-row class="collapse-content">
          <gv-form-item keyName="客户端修改订单" prop="isOpenUpdate">
            <gv-radio-group
              v-model="form.isOpenUpdate"
              optionType="OpenStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="提交订单是否弹出确认窗口" prop="isNeedConfirm">
            <gv-radio-group
              v-model="form.isNeedConfirm"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="待支付时手动同步订单" prop="isManualSync">
            <gv-radio-group
              v-model="form.isManualSync"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="客户端显示反馈意见" prop="isShowOpinion">
            <gv-radio-group
              v-model="form.isShowOpinion"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
        </el-row>
      </gv-collapse-item>
      <gv-collapse-item title="人工报价功能配置" name="2">
        <el-row class="collapse-content">
          <gv-form-item keyName="人工报价" prop="isOpenArtificial">
            <gv-radio-group
              v-model="form.isOpenArtificial"
              optionType="OpenStatus"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item keyName="选择账号" prop="isNeedChoose">
            <gv-checkbox v-model="form.isNeedChoose"
              >人工报价需要选择报价出单账号</gv-checkbox
            >
          </gv-form-item>
          <gv-form-item keyName="人工报价提示" prop="artificialQuotaPrompt">
            <el-input
              type="textarea"
              :rows="3"
              show-word-limit
              v-model="form.artificialQuotaPrompt"
              placeholder="1、私家车需上传投被保人车主身份证正反面照、行驶证正反面照
2、公户车需上传工商营业执照、行驶证正反面照，如需专票还需其他资料，请致电咨询"
              maxlength="500"
              :disabled="isReadOnly"
            ></el-input>
          </gv-form-item>
          <gv-form-item
            keyName="人工报价支持保险公司"
            prop="artificialSupportIc"
          >
            <gv-tree-tag
              v-model="form.artificialSupportIc"
              urlType="IcOption"
              :disabled="isReadOnly"
            ></gv-tree-tag>
          </gv-form-item>
        </el-row>
      </gv-collapse-item>
    </gv-collapse>
  </gv-form>
</template>

<script>
import { getRegionTree } from "@/api/sys";
import addLpr from "./add-lpr.vue";
export default {
  name: "feature-form",
  components: {
    addLpr,
  },
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
      form: {
        taxManualRange: [0, 99],
        forceManualRange: [0, 99],
        bizManualRange: [0, 99],
        queryWay: [],
      },
      rules: {
        queryWay: [
          { required: true, message: "请选择查询车型方式", trigger: "change" },
        ],
      },
      checked: false,
    };
  },
  methods: {
    test() {
      console.log(this.form);
    },
    selectChange(e, type) {
      if (e == 1) {
        this.$set(this.form, type, "MANUAL");
      } else {
        this.$set(this.form, type, null);
      }
    },
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
}
.form {
  .title {
    font-size: 15px;
    font-weight: 500;
    padding: 15px 20px;
  }
}
.check_col {
  width: 200px;
  display: flex;
  flex-direction: column;
  label {
  }
}
.nobottom /deep/.el-form-item {
  margin-bottom: 5px;
}
</style>