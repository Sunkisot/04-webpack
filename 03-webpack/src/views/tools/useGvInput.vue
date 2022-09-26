<template>
  <div style="margin-top: 20px">
    <gv-input
      :thou="true"
      maxlength="21"
      v-model="input"
      pattern-key="Zero"
      num-len="2"
    ></gv-input>

    <!-- <gv-form>
      
    </gv-form> -->
  </div>
</template>

<script>
import mixin from '@/mixins/index.js'
export default {
  name: "useGvInput",
  mixins: ['mixin'],
  data() {
    return {
      input: '1231'
    };
  },
  created() {
    console.log(this.mixin)
  }
};
</script>

<style>
</style>