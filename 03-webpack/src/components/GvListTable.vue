<template>
  <section>
    <div>
      <slot name="header" :page="page"></slot>
      <el-table
        v-bind="$attrs"
        ref="multipleTable"
        class="multipleTable"
        :border="border"
        :data="tableData"
        :stripe="stripe"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
        @filter-change="filterTagTable"
        @current-change="clickChange"
      >
        <!-- 序号 -->
        <el-table-column
          v-if="isSerial"
          type="index"
          label="序号"
          :index="indexMethod"
          width="55"
        >
        </el-table-column>
        <!-- 复选 -->
        <el-table-column
          v-if="isSelected"
          type="selection"
          :reserve-selection="true"
          width="50"
        >
        </el-table-column>
        <!-- 单选 -->
        <el-table-column width="55" v-if="isRadio">
          <template slot-scope="scope">
            <el-radio v-model="tableRadio" :label="scope.row"><i></i></el-radio>
          </template>
        </el-table-column>
        <slot></slot>
      </el-table>
      <div
        class="planpage"
        style="
          width: 100%;
          padding-left: 15px;
          margin-top: 8px;
          overflow: hidden;
        "
      >
        <el-pagination
          style="display: flex; justify-content: center"
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="page.pageSize"
          :layout="pageLayout"
          :total="page.total"
          :current-page.sync="page.pageNo"
        >
        </el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
/**
 * 分页表格
 * @author 计欣奇
 * @time 2020/11/08
 */
export default {
  name: "GvListTable",
  props: {
    url: {
      type: String,
    },
    requestType: {
      type: String,
      default: () => "get",
    },
    isPage: {
      // 是否前端分页 true 前端分页 false 后端分页
      type: Boolean,
      default: () => false,
    },
    keyVal: {
      // 确保唯一的键值 list 如果开启 isInitPage 的 复选 keyVal必填  可以传多个属性拼接成唯一键值
      type: Array,
      default: () => [],
    },
    isSelected: {
      // 是否开启复选
      type: Boolean,
      default: () => true,
    },
    isSerial: {
      // 是否展示序号
      type: Boolean,
      default: () => false,
    },
    isRadio: {
      type: Boolean,
      default: () => false,
    },
    cacheList: {
      // 缓存分页
      type: Array,
      default: () => [],
    },
    searchParams: {
      // 后端分页的查询参数
      type: Object,
    },
    border: {
      // 是否展示可拖拽边框
      type: Boolean,
      default: () => false,
    },
    stripe: {
      type: Boolean,
      default: () => false,
    },
    pageLayout: {
      type: String,
      default: () => "total, prev, pager, next, jumper",
    },
    pageSize: {
      // 修改默认分页
      type: Number,
      default: () => 10,
    },
  },
  data() {
    // 双向绑定页面显示数据
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      api: null,
      data: null,
      multipleSelection: [],
      currentPage: 0,
      tableData: [],
      isReadonly: false, //是否可以编写
      pageFlag: false, // 是否前端分页
      cacheData: [],
      tableRadio: {},
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowKey(row) {
      return this.keyVal.reduce((str, v) => {
        return str + row[v];
      }, "");
    },
    clickChange(item) {
      this.tableRadio = item;
    },
    getSelection() {
      return this.multipleSelection;
    },
    // 获取表格单选数据
    getRadioData() {
      return this.tableRadio;
    },
    // 序号
    indexMethod(index) {
      index = index + 1 + (this.page.pageNo - 1) * this.page.pageSize;
      return index;
    },
    // 表头筛选方法
    filterTagTable(val) {
      this.$emit("filter-change", val);
    },
    // 清除筛选
    clearFilter(val) {
      this.$refs.multipleTable.clearFilter(val);
    },
    // pageSize改变
    onHandleSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageNo = 1;
      if (this.pageFlag) {
        this.getPageData();
      } else {
        this.getInsData(this.page);
      }
    },
    // pageNo改变
    onHandleCurrentChange(val) {
      this.page.pageNo = val;
      if (this.pageFlag) {
        this.getPageData();
      } else {
        this.getInsData(this.page);
      }
    },
    // 后端分页 获取数据
    async getInsData(page) {
      if (this.requestType == "get") {
        var res = await this.gvUtil.http({
          url: this.url,
          method: "get",
          params: {
            curPage: page.pageNo,
            size: page.pageSize,
            ...this.data,
          },
        });
      } else {
        var res = await this.gvUtil.http({
          url: this.url,
          method: "post",
          data: {
            curPage: page.pageNo,
            size: page.pageSize,
            ...this.data,
          },
        });
      }
      if (res && res.code === '00000') {
        this.tableData = res.data.list || [];
        this.page.total = res.data.totalCount;
        this.$emit("search-results", res.data);
      }
    },
    // 前端分页 获取数据方法
    getPageData() {
      var _this = this;
      this.tableData = this.cacheData.slice(
        (this.page.pageNo - 1) * this.page.pageSize,
        this.page.pageNo * this.page.pageSize
      );
      this.page.total = this.cacheData.length;
    },
    // 公共初始化页面方法
    initComponent(dataList) {

      this.$forceUpdate();
      this.page = {
        pageNo: 1,
        pageSize: this.pageSize,
        total: 0,
      };
      if (this.isPage) {
        // 前端分页
        this.pageFlag = true;
        this.$forceUpdate();
        this.cacheData = JSON.parse(JSON.stringify(dataList));
        this.getPageData();
      } else {
        // 后端分页
        this.pageFlag = false;
        this.data = JSON.parse(JSON.stringify(this.searchParams));
        this.getInsData(this.page);
      }
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.setCurrentRow();
    },
  },
  computed: {
    alldata() {
      return this.$route.params.data;
    },
  },
  watch: {},
  mounted() {},
  created() {},
};
</script>

<style lang="scss" scoped>
</style>
