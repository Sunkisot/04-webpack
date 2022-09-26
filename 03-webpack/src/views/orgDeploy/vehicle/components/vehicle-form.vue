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
      <gv-collapse-item title="车辆信息配置" name="1">
        <el-row class="collapse-content">
          <gv-form-item keyName="是否支持非客车" prop="isSupportNonbus">
            <gv-radio-group
              v-model="form.isSupportNonbus"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <el-row class="fieldTable">
            <el-table :data="form.vehicleFields" >
              <el-table-column prop="name" label="需填写车辆信息">
              </el-table-column>
              <el-table-column prop="localNeed" label="本地车需要填写" width="200">
                <template #default='{row}'>
                  <gv-switch v-model="row.localNeed" :disabled='isReadOnly'></gv-switch>
                </template>
              </el-table-column>
              <el-table-column prop="otherNeed" label="外地车需要填写" width="200">
                <template #default='{row}'>
                  <gv-switch v-model="row.otherNeed" :disabled='isReadOnly'></gv-switch>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
      </gv-collapse-item>
    </gv-collapse>
  </gv-form>
</template>

<script>
export default {
  name: "vehicle-form",
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
      form: {
      },
      rules: {
      },
    };
  },
  methods: {
    // 获取表单数据
    getFormData() {
      return this.form
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
  margin-top: 60px;
}
</style>