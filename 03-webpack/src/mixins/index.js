export default {
  data() {
    return {
    }
  },
  methods: {
    // 刷新页面
    refreshPage() {
      this.$router.push({
        path: "/redirect" + this.$route.fullPath,
      });
    },
  },
  computed: {
    querys() {
      return { ...this.$route.query, ...this.$route.params }
    }
  },
  created() {
  }
}
