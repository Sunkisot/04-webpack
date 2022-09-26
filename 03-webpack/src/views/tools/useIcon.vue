<template>
  <section>icon图标：
    <p v-for='item in iconArr' :key='item'>{{item}}: <svg-icon :icon-class="item" /></p> 
  </section>
</template>

<script>
export default {
  name: "useSvgIcon",
  data() {
    return {
      iconArr: [],
    };
  },
  methods: {
    readSvg() {
      const req = require.context("../../assets/icons/svg", false, /\.svg$/);
      const requireAll = (requireContext) =>
        requireContext.keys().reduce((m, e) => {
          m.push(e.match(/^.\/+\S+.svg$/)[0].slice(2, -4));
          return m;
        }, []);
      this.iconArr = requireAll(req);
    },
  },
  created() {
    this.readSvg()
  },
};
</script>

<style>
</style>