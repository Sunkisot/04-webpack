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
            <gv-form-item keyName="人员姓名" prop="name">
              <el-input
                v-model="form.name"
                placeholder="输入人员姓名"
                maxlength="10"
                :disabled="isReadOnly"
              ></el-input>
            </gv-form-item>
            <gv-form-item keyName="登录账号" prop="username">
              <gv-input
                v-model="form.username"
                placeholder="输入登录账号（仅支持数字、英文，例如wangxm001）"
                patternKey="PATTERN_ORDERNO"
                maxlength="20"
                :disabled="isReadOnly"
              ></gv-input>
            </gv-form-item>
            <gv-form-item keyName="登录密码" prop="password">
              <gv-input
                type="password"
                v-model="form.password"
                placeholder="输入登录密码"
                patternKey="PATTERN_ORDERNO"
                maxlength="20"
                :disabled="isReadOnly"
              ></gv-input>
            </gv-form-item>
            <gv-form-item class="nobottom" keyName="人员角色" prop="isSuperAdmin">
              <el-radio-group class="colRadio" v-model="form.isSuperAdmin" @change="radioChange">
                <el-radio :label="1"
                  >超级管理员<span class="tip ml10"
                    >设为超级管理员后，人员将拥有平台全部的的操作权限与数据查看权限，无需分配人员角色</span
                  ></el-radio
                >
                <el-radio :label="0">普通人员</el-radio>
              </el-radio-group>
            </gv-form-item>
            <gv-form-item v-if='form.isSuperAdmin == 0' prop='roleIdList'>
              <gv-select
                class="pl20"
                urlType="RoleOption"
                codeName='id'
                labelName='roleName'
                v-model="form.roleIdList"
                multiple
                placeholder="请选择人员角色"
              ></gv-select>
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
import { postAddUser, putAddUser, getUserDetail } from "@/api/paasDeploy";
export default {
  name: "member-detail",
  props: {
    type: null,
  },
  data(vm) {
    return {
      isReadOnly: false,
      form: {
        isSuperAdmin: 0,
        roleIdList: []
      },
      rules: {
        name: [{ required: true, message: "请输入人员姓名", trigger: "blur" }],
        username: [
          { required: true, message: "请输入登陆账号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登陆密码", trigger: "blur" },
        ],
        roleIdList: [
          { required: true, message: "请选择人员角色", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    radioChange() {
      this.form.roleIdList = []
    },
    // 保存
    async handleSave() {
      let isok = await this.$refs.form.validate();
      if (!isok) {
        this.$message.warning("请完善信息！");
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
          path: "/paas-deploy/member-index",
        });
      } else {
        this.gvUtil.error(res.message);
      }
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
    this.type == "edit" && this.initDetail();
    console.log(this.type);
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
.colRadio {
  display: flex;
  flex-direction: column;
  label {
    margin: 10px 0;
  }
}
.tip {
  font-size: 12px;
  line-height: 1.5;
  color: #aaaaaa;
  margin-bottom: 4px;
}
</style>