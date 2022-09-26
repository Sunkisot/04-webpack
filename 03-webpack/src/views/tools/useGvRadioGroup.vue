<template>
  <div class="wrapper">
    <gv-radio-group v-model="value" codeType='Currency'></gv-radio-group>
  </div>
</template>

<script>
export default {
  name:'useGvRadioGroup', 
  data() {
    return {
      value: ''
    }
  }
}
</script>

<style>
.wrapper {
  padding: 20px;
}
</style>