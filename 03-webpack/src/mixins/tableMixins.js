
export default {
  /**
   * 表格混合对象
   * @author 计昕奇
   * @time 2021/01/19
   */
  data: function data() {
    return {
      mixinObject: {
        searchSet: { // 查询设置，因定写法
          total: 0,
          pageNo: 1,
          pageSize: 10,
        },
        isInit: false // 区分 页码变动查询 和 正常查询
      },
      cacheFilters: {}
    };
  },
  methods: {
    /**
     * 获取请求参数 默认只传递_pageNo(页码) _pageSize(每页条数) 可以由调用方传递指定对象合并(或者覆盖)原参数
     * @param params
     * @returns {*}
     */
    getParamsMixin: function getParamsMixin(params) {
      this.cacheFilters = Object.assign({
        size: this.mixinObject.searchSet.pageSize,
        curPage: this.mixinObject.searchSet.pageNo
      }, params);
      return this.cacheFilters;
    },

    /**
     * 页码变动
     * @param val 码数
     */
    onHandleCurrentChange: function onHandleCurrentChange(val) {
      if (typeof val === 'undefined') {
        return;
      }
      this.mixinObject.searchSet.pageNo = val;
      this.mixinObject.isInit = true;
      this.onGetList();
    },

    /**
     * 查询行数变动
     * @param 行数
     */
    onHandleSizeChange: function onHandleSizeChange(val) {
      this.mixinObject.searchSet.pageSize = val;
      this.mixinObject.isInit = true;
      this.onGetList();
    },

    /**
     * 获取查询数据
     */
    onGetList: function onGetList() { },
    searchList: async function searchList(url, filters, voName, call) {
      if (!this.mixinObject.isInit) {
        this.mixinObject.searchSet.pageNo = 1;
      } else {
        this.mixinObject.isInit = false;
      }
      var params = this.getParamsMixin(filters),
        _this = this,
        list = [],
        headList = [];
      try {
        var res = await this.gvUtil.http({
          url,
          method: 'post',
          data: params
        })
        _this.mixinObject.searchSet.total = res.data.totalCount
        list = res.data[voName];
      } catch(err) {
        list = [];
        this.mixinObject.searchSet.total = 0;
      }
      typeof call === 'function' && call(list, res);
    },
    onResetForm: function onResetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }

}