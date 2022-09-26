<template>
  <div class="videoBox">
    <el-table v-if="data.length" :data="data" style="width: 100%">
      <el-table-column label="序号" width="100">
        <template #default="{ row }">
          <set-serial :row="row" prop="serialNumer" :cur_icId='cur_icId'></set-serial>
        </template>
      </el-table-column>
      <el-table-column prop="materialType" label="资料类型" width="180">
      </el-table-column>
      <el-table-column prop="imageNameList" label="影像资料" >
        <template #default="{ row }">
          <el-tag class="mr10" v-for="tag in row.imageNameList" :key="tag">
            {{ tag.imageName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="Operation" label="操作" fixed="right" width="180">
        <template #default="{ row }">
          <el-button class="mr10" type="text" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button class="txt-red-btn" type="text" @click="handleDel(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div v-else class="noData">
      <div class="img"></div>
      <p>暂未配置%保险公司名称%的影像资料</p>
      <span
        >您可选择为当前保险公司新增影像资料，也可复制其它保险公司影像资料到此保险公司</span
      >
    </div>
  </div>
</template>

<script>
import {delVideo} from '@/api/insDeploy'
import setSerial from "./set-serial.vue";
export default {
  name: "video-table",
  components: {
    setSerial,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    cur_icId: null
  },
  data() {
    return {};
  },
  methods: {
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: "/ins-deploy/video-add/edit",
        query: {
          id: row.id,
        },
      });
    },
    // 删除
    handleDel(row) {
      this.$confirm("确定要删除这条影像资料吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "danger",
      }).then(async () => {
        let res = await delVideo(row.id);
        if (res && res.code == "00000") {
          this.gvUtil.success();
          this.$event.$emit("refresh");
        } else {
          this.$alert(res.message, "无法删除", {
            confirmButtonText: "知道了",
            type: "info",
          });
        }
      });
    },
  },
  watch: {},
};
</script>

<style lang='less' scoped>
.videoBox {
  .noData {
    text-align: center;
    margin-top: 150px;
    width: 100%;
    .img {
      display: inline-block;
      width: 300px;
      height: 170px;
      background: url("../../../../assets/images/noData.svg");
    }
  }
}
.cell .el-tag {
  margin-right: 10px;
  margin-top: 5px;
}
</style>