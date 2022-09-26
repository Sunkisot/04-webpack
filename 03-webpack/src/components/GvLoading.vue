<script>
/**
 * 遮照
 * @author 计昕奇
 * @time 2019/05/05
 */
export default {
  name: "gvLoading",
  data() {
    return {
      shade: null
    }
  },
  methods: {
    showLoading() {
      this.shade = this.$loading({
        lock: true,
        text: this.$t('gLoading'),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.2)",
      });
    },
    closeLoading() {
      this.shade.close();
    }
  },
  watch: {
    loading(val) {
      if(val) {
        this.showLoading()
      }else {
        this.closeLoading()
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    }
  },
  render(h) {
    return h()
  }
};
</script>
