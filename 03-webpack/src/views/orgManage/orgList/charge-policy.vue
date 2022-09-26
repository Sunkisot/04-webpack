<template>
  <div class="wrapper">
    <gv-form
      ref="form"
      class="form_body pd20"
      :model="form"
      :rules="rules"
      :col="1"
      label-width="200px"
    >
      <gv-collapse open-all disabled>
        <gv-collapse-item title="计费政策配置" name="1">
          <el-row class="collapse-content">
            <gv-form-item keyName="组织机构" prop="mechanismId">
              <gv-tree-select
                v-model="form.mechanismId"
                urlType="OrgTree"
                placeholder="选择组织机构"
                disabled
              ></gv-tree-select>
            </gv-form-item>
            <gv-form-item keyName="短信单价" prop="sms">
              <gv-input
                v-model="form.sms"
                placeholder="输入短信单价"
                maxlength="21"
                :thou="true"
                numLen="2"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>元 / 条</span>
                </template>
              </gv-input>
            </gv-form-item>
            <gv-form-item keyName="查询续保" prop="renewal">
              <gv-input
                v-model="form.renewal"
                placeholder="输入查询续保单价"
                maxlength="21"
                :thou="true"
                numLen="2"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>元 / 次</span>
                </template>
              </gv-input>
            </gv-form-item>
            <gv-form-item keyName="报价单价" prop="quotation">
              <gv-input
                v-model="form.quotation"
                placeholder="输入报价单价"
                maxlength="21"
                :thou="true"
                numLen="2"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>元 / 次</span>
                </template>
              </gv-input>
            </gv-form-item>
            <gv-form-item keyName="查询车辆信息" prop="vehicle">
              <gv-input
                v-model="form.vehicle"
                placeholder="输入查询车辆信息单价"
                maxlength="21"
                :thou="true"
                numLen="2"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>元 / 次</span>
                </template>
              </gv-input>
            </gv-form-item>
            <gv-form-item keyName="采集身份证" prop="idCollect">
              <gv-input
                v-model="form.idCollect"
                placeholder="输入采集身份证单价"
                maxlength="21"
                :thou="true"
                numLen="2"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>元 / 次</span>
                </template>
              </gv-input>
            </gv-form-item>
            <gv-form-item keyName="开通机构" prop="org">
              <gv-input
                v-model="form.org"
                placeholder="输入开通机构单价"
                maxlength="21"
                :thou="true"
                numLen="2"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>元 / 个</span>
                </template>
              </gv-input>
            </gv-form-item>
            <gv-form-item keyName="从平台出保单" prop="policy">
              <gv-input
                v-model="form.policy"
                placeholder="输入从平台出保单单价"
                maxlength="21"
                :thou="true"
                numLen="2"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>元 / 张</span>
                </template>
              </gv-input>
            </gv-form-item>
            <gv-form-item keyName="开通业务员" prop="agent">
              <gv-input
                v-model="form.agent"
                placeholder="输入开通业务员单价"
                maxlength="21"
                :thou="true"
                numLen="2"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>元 / 人</span>
                </template>
              </gv-input>
            </gv-form-item>
            <gv-form-item keyName="业务员使用月费" prop="agentUse">
              <gv-input
                v-model="form.agentUse"
                placeholder="输入业务员使用月费"
                maxlength="21"
                :thou="true"
                numLen="2"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>元 / 月 / 人</span>
                </template>
              </gv-input>
            </gv-form-item>
          </el-row>
        </gv-collapse-item>
        <gv-collapse-item title="平台其他渠道配置" name="2">
          <el-row class="collapse-content">
            <gv-form-item keyName="是否使用平台发送短信" prop="isPlatformSms">
              <gv-radio-group
                v-model="form.isPlatformSms"
                optionType="whether"
                :disabled="isReadOnly"
              ></gv-radio-group>
            </gv-form-item>
            <gv-form-item
              keyName="是否特殊渠道查询车辆信息"
              prop="isSpecialQueryVehicle"
            >
              <gv-radio-group
                v-model="form.isSpecialQueryVehicle"
                optionType="whether"
                :disabled="isReadOnly"
              ></gv-radio-group>
            </gv-form-item>
            <gv-form-item
              keyName="每天限制查询特殊渠道次数"
              prop="specialDayLimit"
            >
              <gv-input
                v-model="form.specialDayLimit"
                maxlength="7"
                :thou="true"
                numLen="0"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>次</span>
                </template>
              </gv-input>
            </gv-form-item>
            <gv-form-item
              keyName="每周限制查询特殊渠道次数"
              prop="specialWeekLimit"
            >
              <gv-input
                v-model="form.specialWeekLimit"
                maxlength="7"
                :thou="true"
                numLen="0"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>次</span>
                </template>
              </gv-input>
            </gv-form-item>
            <gv-form-item
              keyName="每月限制查询特殊渠道次数"
              prop="specialMonthLimit"
            >
              <gv-input
                v-model="form.specialMonthLimit"
                maxlength="7"
                :thou="true"
                numLen="0"
                :disabled="isReadOnly"
              >
                <template #suffix>
                  <span>次</span>
                </template>
              </gv-input>
            </gv-form-item>
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
  getMcBillingDetail,
  postMcBilling,
  putMcBilling,
} from "@/api/orgManage";
export default {
  name: "charge-policy",
  components: {},
  data() {
    return {
      isReadOnly: false,
      type: "add", // add 新增 edit 编辑
      form: {
        isPlatformSms: 0,
        isSpecialQueryVehicle: 0,
        specialDayLimit: 0,
        specialWeekLimit: 0,
        specialMonthLimit: 0,
      },
      rules: {
        mechanismId: [
          { required: true, message: "请选择组织机构", trigger: "blur" },
        ],
        sms: [{ required: true, message: "请输入短信单价", trigger: "blur" }],
        renewal: [
          { required: true, message: "请输入查询续保单价", trigger: "blur" },
        ],
        quotation: [
          { required: true, message: "请输入报价单价", trigger: "blur" },
        ],
        vehicle: [
          {
            required: true,
            message: "请输入查询车辆信息单价",
            trigger: "blur",
          },
        ],
        idCollect: [
          { required: true, message: "请输入采集身份证单价", trigger: "blur" },
        ],
        org: [
          { required: true, message: "请输入开通机构单价", trigger: "blur" },
        ],
        policy: [
          {
            required: true,
            message: "请输入从平台出保单单价",
            trigger: "blur",
          },
        ],
        agent: [
          { required: true, message: "请输入开通业务员单价", trigger: "blur" },
        ],
        agentUse: [
          { required: true, message: "请输入业务员使用月费", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 保存
    async handleSave() {
      let isok = await this.$refs.form.validate();
      if (!isok) return;
      let res =
        this.type == "edit"
          ? await putMcBilling(this.form)
          : await postMcBilling(this.form);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.$router.back();
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 初始化详情
    async initDetail() {
      let res = await getMcBillingDetail(this.querys.id);
      if (res && res.code == "00000") {
        this.type = "edit";
        this.form = Object.assign({}, res.data || this.form);
      } else {
        this.querys.type == "noTip" || this.gvUtil.error(res.message);
        this.type = "add";
        this.$set(this.form, "mechanismId", this.querys.id);
      }
    },
  },
  created() {
    this.initDetail();
  },
};
</script>

<style lang='less' scoped>
.collapse-content {
  max-width: 800px;
}
</style>