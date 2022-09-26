<template>
  <div class="wrapper">
    <gv-form
      ref="form"
      class="form form_body pd20"
      :model="form"
      :rules="rules"
      :col="1"
      label-width="200px"
    >
      <gv-collapse open-all>
        <gv-collapse-item title="基本信息" name="1">
          <el-row class="collapse-content">
            <gv-form-item keyName="归属机构" prop="mechanismId">
              <gv-tree-select
                v-model="form.mechanismId"
                urlType="OrgTree"
                placeholder="选择归属机构"
                @select="mechanismSelect"
                :disabled="isReadOnly"
              ></gv-tree-select>
            </gv-form-item>
            <gv-form-item keyName="归属机构编码">
              <el-input
                v-model="form.mechanismCode"
                placeholder="选择归属机构"
                disabled
              ></el-input>
            </gv-form-item>
            <gv-form-item keyName="成员姓名" prop="name">
              <el-input
                v-model="form.name"
                placeholder="输入成员姓名"
                maxlength="10"
                :disabled="isReadOnly"
              ></el-input>
            </gv-form-item>
            <gv-form-item keyName="登录账号" prop="username">
              <gv-input
                v-model="form.username"
                patternKey="PATTERN_ORDERNO"
                placeholder="输入登录账号"
                maxlength="20"
                :disabled="isReadOnly || type == 'edit'"
              ></gv-input>
            </gv-form-item>
            <gv-form-item keyName="登录密码" prop="password">
              <gv-input
                type="password"
                v-model="form.password"
                patternKey="PATTERN_ORDERNO"
                placeholder="输入登录密码"
                maxlength="20"
                :disabled="isReadOnly"
              ></gv-input>
            </gv-form-item>
            <gv-form-item prop="workWXQrCode">
              <template #label>
                企业微信码
                <svg-icon icon-class="question" @click="openEffect" />
              </template>
              <gv-img-upload
                v-model="form.workWXQrCode"
                :disabled="isReadOnly"
              ></gv-img-upload>
            </gv-form-item>
            <gv-form-item keyName="备注" prop="remark">
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
            <gv-form-item
              keyName="业务员设置"
              prop="isSalesman"
              class="saleFormItem"
              v-if="type == 'add'"
            >
              <el-checkbox
                v-model="form.isSalesman"
                :true-label="1"
                :false-label="0"
                >同时添加为业务员</el-checkbox
              >
            </gv-form-item>
            <gv-form-item v-if="form.isSalesman == 1" prop="phone">
              <gv-input
                v-model="form.phone"
                placeholder="输入业务员手机号"
                patternKey="telNumber"
                :disabled="isReadOnly"
              ></gv-input>
            </gv-form-item>
            <!-- <gv-form-item
              keyName="管理员设置"
              prop="isSuperAdmin"
              class="saleFormItem"
            >
              <el-checkbox
                v-model="form.isSuperAdmin"
                :true-label="1"
                :false-label="0"
                >设置为超级管理员</el-checkbox
              >
            </gv-form-item>
            <gv-form-item>
              <div style="line-height: 1.5">
                <span class="f-12 c-7F7F7F"
                  >设为超级管理员后，成员将拥有顶级机构及其全部子机构的操作管理权限与数据查看权限</span
                ><br />
                <span class="f-12 c-7F7F7F"
                  >设为超级管理员后，无需再次设置成员权限，添加的成员权限系统视为无效</span
                >
              </div>
            </gv-form-item> -->
          </el-row>
        </gv-collapse-item>
        <gv-collapse-item name="2">
          <template #title>
            <span>成员权限</span>
            <span class="f-12 c-7F7F7F"
              >（该成员的角色拥有的保险公司以及机构的权限）</span
            >
          </template>
          <el-row class="collapse-content">
            <memb-prem
              ref="membPrem"
              :data="form.userPermList"
              :formData="form"
            ></memb-prem>
          </el-row>
        </gv-collapse-item>
      </gv-collapse>
    </gv-form>
    <div class="bottom_btn_row">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>

    <el-dialog
      title="效果展示"
      :visible.sync="effectVisible"
      width="800px"
      center
    >
      <div class="content">
        <div class="conItem">
          <div class="cI_num">1</div>
          <el-image
            style="width: 250px"
            :src="require('@/assets/images/effect1.png')"
          ></el-image>
          <div class="tip">
            上传<span class="c-000 f-500">出单员</span>企业微信码后，<span
              class="c-000 f-500"
              >业务员</span
            >
            在人工报价时可点击<span class="c-000 f-500">企业微信联系</span>
          </div>
        </div>
        <div class="conItem">
          <div class="cI_num">2</div>
          <el-image
            style="width: 250px"
            :src="require('@/assets/images/effect2.png')"
          ></el-image>
          <div class="tip">
            业务员可添加<span class="c-000 f-500">出单员企业微信</span>进行<span
              class="c-000 f-500"
              >人工报价</span
            >出单业务的跟进
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postAddUser, putAddUser, getUserDetail } from "@/api/orgManage";
import membPrem from "./components/memb-prem";
export default {
  name: "memb-detail",
  components: {
    membPrem,
  },
  props: {
    type: null,
  },
  data(vm) {
    return {
      isReadOnly: false,
      effectVisible: false, // 效果展示弹窗
      form: {
        imageUrl: "",
        isSalesman: 0,
        userPermList: [],
      },
      rules: {
        mechanismId: [
          { required: true, message: "请选择归属机构", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入成员姓名", trigger: "blur" }],
        username: [
          { required: true, message: "请输入登陆账号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登陆密码", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入业务员手机号", trigger: "blur" },
        ],
      },
      test: ["1", "2"],
    };
  },
  methods: {
    // 机构change
    mechanismSelect(e) {
      this.$set(this.form, "mechanismCode", e.code);
    },
    // 保存
    async handleSave() {
      let isok = await this.$refs.form.validate();
      if (!isok) {
        this.$message.warning("请完善信息！");
        return;
      }
      this.form.userPermList = this.$refs.membPrem.getTableData() || [];
      if (this.form.isSuperAdmin != 1 && this.form.userPermList.length == 0) {
        this.$message.warning("请添加成员权限!");
        return;
      }
      this.postSave();
    },
    // 保存接口
    async postSave() {
      let res =
        this.type == "add"
          ? await postAddUser(this.form)
          : await putAddUser(this.form);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.$router.replace({
          path: "/org-manage/org-member",
        });
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 展示效果
    openEffect() {
      this.effectVisible = true;
    },
    // 初始化详情
    async initDetail() {
      let res = await getUserDetail({
        userId: this.querys.id,
      });
      if (res && res.code == "00000") {
        this.form = Object.assign({}, res.data);
      } else {
        this.gvUtil.error(res.message);
      }
    },
  },
  created() {
    if (this.type == "edit") {
      this.initDetail();
      delete this.rules.password;
    }
  },
};
</script>

<style lang='less' scoped>
.wrapper {
  .form {
    .collapse-content {
      max-width: 800px;
    }
    .saleFormItem /deep/.el-form-item {
      margin-bottom: 0 !important;
    }
  }
}
.content {
  display: flex;
  justify-content: space-around;
  .conItem {
    display: flex;
    flex-direction: column;
    align-items: center;

    .cI_num {
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background: #3977f6;
      color: #fff;
      border-radius: 30px;
      margin-bottom: 20px;
    }
    .tip {
      width: 220px;
      line-height: 1.5;
    }
  }
}
</style>