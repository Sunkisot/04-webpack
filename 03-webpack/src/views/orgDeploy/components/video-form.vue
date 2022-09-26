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
      <gv-collapse-item title="影像信息配置" name="2">
        <el-row class="collapse-content">
          <gv-form-item keyName="是否自动核保" prop="isAutoReview">
            <gv-radio-group
              v-model="form.isAutoReview"
              optionType="whether"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item
            class="nobottom"
            keyName="影像是否支持同步上传到保险公司"
            prop="isRequirePhoto"
          >
            <gv-radio-group
              v-model="form.isRequirePhoto"
              optionType="Supports"
              :disabled="isReadOnly"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item
            v-if="form.isRequirePhoto == 1"
            class="ml20"
            prop="clientRequirePhoto"
          >
            <gv-radio-group
              v-model="form.clientRequirePhoto"
              optionType="ClientRequirePhoto"
              :disabled="isReadOnly"
              mode="col"
            ></gv-radio-group>
          </gv-form-item>
          <gv-form-item
            class="nobottom"
            keyName="提交订单上传影像资料信息"
            prop="isOpenRequirePhoto"
          >
            <gv-switch v-model="form.isOpenRequirePhoto" :disabled="isReadOnly">
            </gv-switch>
          </gv-form-item>
        </el-row>
        <el-row v-if="form.isOpenRequirePhoto == 1" class="orderTable">
          <el-table :data="form.orderPhotos" empty-text="暂无影像资料，请添加">
            <el-table-column prop="type" label="资料类型" width="180">
            </el-table-column>
            <el-table-column prop="vehiclePhoto" label="车辆照片" width="180">
            </el-table-column>
            <el-table-column prop="isRequir" label="设为必传">
              <template #default="{ row }">
                <gv-switch v-model="row.isRequir"></gv-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作"
              ><template #default="{ $index }">
                <el-button
                  class="txt-red-btn"
                  type="text"
                  @click="handleDel($index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <TpCascader
            v-model="form.orderPhotos"
            class="mt10"
            btn_txt="添加一条影像资料"
            :searchObject="{ icId: '1' }"
            bizType='ORDER'
          ></TpCascader>
        </el-row>
        <gv-form-item
          keyName="核保不通过上传影像资料信息"
          prop="isOpenRequirePhoto"
        >
        </gv-form-item>
        <el-row class="failTable">
          <el-table :data="form.failPhotos" empty-text="暂无影像资料，请添加">
            <el-table-column prop="type" label="资料类型" width="180">
            </el-table-column>
            <el-table-column prop="vehiclePhoto" label="车辆照片" width="180">
            </el-table-column>
            <el-table-column prop="isRequir" label="设为必传">
              <template #default="{ row }">
                <gv-switch v-model="row.isRequir"></gv-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作"
              ><template #default="{ $index }">
                <el-button
                  class="txt-red-btn"
                  type="text"
                  @click="handleDel($index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <TpCascader
            v-model="form.failPhotos"
            class="mt10"
            btn_txt="添加一条影像资料"
            :searchObject="{ icId: '1' }"
            bizType='FAIL'
          ></TpCascader>
        </el-row>
      </gv-collapse-item>
    </gv-form>
  </gv-collapse>
</template>

<script>
import TpCascader from "./tp-cascader.vue";
export default {
  name: "video-from",
  components: {
    TpCascader,
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
      checked: false,
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