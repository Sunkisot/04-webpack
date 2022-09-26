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
        <gv-collapse-item title="基本信息" name="1">
          <el-row class="collapse-content">
            <gv-form-item keyName="资料类型" prop="materialType">
              <el-input
                v-model="form.materialType"
                placeholder="输入资料类型"
                maxlength="20"
                :disabled="isReadOnly"
              ></el-input>
            </gv-form-item>
            <gv-form-item keyName="保险公司" prop="icCode">
              <gv-select
                urlType="IcOption"
                v-model="form.icCode"
                @select="icChange"
                :disabled="isReadOnly"
              ></gv-select>
            </gv-form-item>
          </el-row>
        </gv-collapse-item>
        <gv-collapse-item title="影像资料配置" name="2">
          <el-row class="collapse-content">
            <el-card
              v-for="(item, i) in form.configList"
              :key="i"
              class="box-card add-card"
              shadow="never"
            >
              <gv-form-item
                keyName="影像资料名称"
                :prop="'configList.' + i + '.imageName'"
                :rules="rules.imageName"
              >
                <el-input
                  v-model="item.imageName"
                  placeholder="输入影像资料名称"
                  maxlength="20"
                  :disabled="isReadOnly"
                ></el-input>
              </gv-form-item>
              <gv-form-item
                keyName="影像唯一编码"
                :prop="'configList.' + i + '.imageUniqueNumber'"
                :rules="rules.imageUniqueNumber"
              >
                <gv-input
                  v-model="item.imageUniqueNumber"
                  placeholder="输入影像唯一编码"
                  patternKey="PATTERN_ORDERNO"
                  maxlength="20"
                  :disabled="isReadOnly"
                ></gv-input>
              </gv-form-item>
              <gv-form-item
                class="nobottom"
                keyName="影像示例图"
                prop="exampleImageUrl"
              >
                <gv-img-upload
                  v-model="item.exampleImageUrl"
                  :disabled="isReadOnly"
                  imgWidth="400px"
                  imgHeight="200px"
                  clearable
                ></gv-img-upload>
              </gv-form-item>
              <gv-form-item>
                <el-checkbox
                  v-model="item.checked"
                  :true-label="1"
                  :false-label="0"
                  >默认选中</el-checkbox
                >
              </gv-form-item>
              <el-button
                class="txt-red-btn delBtn"
                type="text"
                @click="handleDel(i)"
                >删除</el-button
              >
            </el-card>
            <el-button
              class="mt10 ml10"
              icon="el-icon-plus"
              type="primary"
              @click="handleAdd"
              >添加一条影像</el-button
            >
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
import { postAddVideo, putAddVideo, getVideoDetail } from "@/api/insDeploy";
export default {
  name: "video-add",
  components: {},
  props: {
    type: "",
  },
  data() {
    return {
      isReadOnly: false,
      form: {
        configList: [
          {
            checked: 0,
          },
        ],
      },
      rules: {
        materialType: [
          { required: true, message: "请输入资料类型", trigger: "blur" },
        ],
        icCode: [
          { required: true, message: "请输入保险公司", trigger: "blur" },
        ],
        imageName: [
          { required: true, message: "请输入影像资料名称", trigger: "blur" },
        ],
        imageUniqueNumber: [
          { required: true, message: "请输入影像唯一编码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 保险公司change
    icChange(e) {
      this.form.icId = e.id
    },
    // 添加
    handleAdd() {
      this.$set(this.form.configList, this.form.configList.length, {
        checked: 0,
      });
    },
    // 删除
    handleDel(i) {
      this.form.configList.splice(i, 1);
    },
    // 保存
    async handleSave() {
      let isok = await this.$refs.form.validate();
      console.log(isok, this.form);
      if (!this.form.configList.length) {
        this.$message.warning("请添加影像资料！");
        return;
      }
      this.postSave();
    },
    // 保存接口
    async postSave() {
      let res =
        this.type == "edit"
          ? await putAddVideo(this.form)
          : await postAddVideo(this.form);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.$router.replace({
          path: "/ins-deploy/vision-index",
        });
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 获取详情
    async initDetail() {
      let res = await getVideoDetail(this.querys.id);
      if (res && res.code == "00000") {
        this.form = res.data || this.form;
      }
    },
  },
  created() {
    this.type == "edit" && this.initDetail();
  },
};
</script>

<style lang='less' scoped>
.content {
  padding: 0 10px;
  min-height: 100vh;
  position: relative;
}
.collapse-content {
  max-width: 800px;
}
.nobottom /deep/.el-form-item {
  margin-bottom: 5px;
}
.add-card {
  padding-top: 20px;
  padding-right: 20px;
  margin-left: 10px;
  margin-top: 10px;
  background-color: #f2f2f2;
  position: relative;
  .delBtn {
    position: absolute;
    right: 20px;
    top: 30px;
  }
}
</style>