<template>
  <div id="app">
    <gv-loading></gv-loading>
    <router-view />
  </div>
</template>
<script>
import recordScreen from '@/components/recordScreen.vue'
export default {
  name: 'app',
  components: {
    recordScreen
  },
  data () {
    return {}
  },
  methods: {
  },
  created () {
  }
}
</script>

<style lang="less">
</style>
