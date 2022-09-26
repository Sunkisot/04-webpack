<script>
import path from 'path'
export default {
  name: "redirect",
  created() {
    const { params, query } = this.$route;
    const { path: url } = params
    this.$router.replace({path: path.resolve('/', url ? url : '')  ,  query})
  },
  render: function(h) {
    return h()
  }
};
</script>