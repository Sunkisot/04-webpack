<template>
  <gv-form
    ref="form"
    class="form"
    :model="form"
    :rules="rules"
    :col="1"
    label-width="200px"
  >
    <gv-collapse open-all>
      <gv-collapse-item title="基本信息" name="1">
        <el-row class="collapse-content">
          <gv-form-item keyName="顶级机构" prop="topName">
            <el-input v-model="form.topName" disabled></el-input>
          </gv-form-item>
          <gv-form-item keyName="机构名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="输入机构名称"
              maxlength="50"
              :disabled="isReadOnly"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="机构类型" prop="type">
            <gv-select urlType="OrgType" v-model="form.type" :disabled="isReadOnly"></gv-select>
          </gv-form-item>
          <gv-form-item keyName="机构简称" prop="simpleName">
            <el-input
              v-model="form.simpleName"
              placeholder="输入机构简称"
              maxlength="50"
              :disabled="isReadOnly"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="机构所在地区" prop="regionCode">
            <gv-cascader
              v-model="form.regionCode"
              :options="options"
              clearable
              :props="{ value: 'code', label: 'name' }"
              placeholder="请选择所在地区"
              :disabled="isReadOnly"
            ></gv-cascader>
          </gv-form-item>
          <gv-form-item keyName="所属保监局" prop="sirbCityCode">
            <gv-select
              url="/insurance/sirb/list"
              codeName="sirbCityCode"
              labelName="sirbName"
              v-model="form.sirbCityCode"
              @select="sirbChange"
              :disabled="isReadOnly"
            ></gv-select>
          </gv-form-item>
          <gv-form-item keyName="详细地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="输入详细地址"
              maxlength="100"
              :disabled="isReadOnly"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="机构所在地邮编" prop="postCode">
            <gv-input
              v-model="form.postCode"
              placeholder="输入机构所在地邮编"
              maxlength="6"
              :disabled="isReadOnly"
            ></gv-input>
          </gv-form-item>
          <gv-form-item keyName="机构电话" prop="phone">
            <gv-input
              v-model="form.phone"
              placeholder="输入机构电话"
              patternKey="telNumber"
              :disabled="isReadOnly"
            ></gv-input>
          </gv-form-item>
          <gv-form-item keyName="账号备注" prop="remark">
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
      </gv-collapse-item>
      <gv-collapse-item title="企业信息" name="2">
        <el-row class="collapse-content">
          <gv-form-item keyName="联系人姓名" prop="contactPerson">
            <el-input
              v-model="form.contactPerson"
              placeholder="输入联系人姓名"
              maxlength="10"
              :disabled="isReadOnly"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="联系电话" prop="contactPhone">
            <gv-input
              v-model="form.contactPhone"
              placeholder="输入联系电话"
              patternKey="telNumber"
              :disabled="isReadOnly"
            ></gv-input>
          </gv-form-item>
          <gv-form-item keyName="联系地址" prop="contactAddress">
            <el-input
              v-model="form.contactAddress"
              placeholder="输入联系地址"
              maxlength="100"
              :disabled="isReadOnly"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="联系人职务" prop="contactPersonTitle">
            <el-input
              v-model="form.contactPersonTitle"
              placeholder="输入联系人职务"
              maxlength="10"
              :disabled="isReadOnly"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="企业规模" prop="companySize">
            <gv-input
              v-model="form.companySize"
              placeholder="输入企业规模（人数）"
              maxlength="10"
              suffix="人"
              :disabled="isReadOnly"
            ></gv-input>
          </gv-form-item>
          <gv-form-item keyName="法人代表" prop="legalPerson">
            <el-input
              v-model="form.legalPerson"
              placeholder="输入法人代表"
              maxlength="10"
              :disabled="isReadOnly"
            ></el-input>
          </gv-form-item>
        </el-row>
      </gv-collapse-item>
    </gv-collapse>
  </gv-form>
</template>

<script>
import { getRegionTree } from "@/api/sys";
export default {
  name: "org-son-form",
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    isReadOnly: {
      type: Boolean,
      default: () => false,
    },
  },
  data(vm) {
    return {
      form: {},
      rules: {
        name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
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
      options: [],
    };
  },
  methods: {
    // 获取表单数据
    async getFormData() {
      let isok = await this.$refs.form.validate();
      return isok ? this.form : null;
    },
    // 所属保监局
    sirbChange(e) {
      if(!e) return
      let { sirbName, sirbProvinceCode } = e;
      this.form.sirbName = sirbName;
      this.form.sirbProvinceCode = sirbProvinceCode;
    },
    // 获取省市区
    async getRegionTree() {
      let res = await getRegionTree();
      if (res && res.code == "00000") {
        this.options = res.data || [];
      }
    },
  },
  watch: {
    formData: {
      handler(val) {
        this.form = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getRegionTree();
  },
};
</script>

<style lang='less' scoped>
.collapse-content {
  max-width: 800px;
}
</style>