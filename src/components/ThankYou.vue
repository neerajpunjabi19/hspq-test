<template>
  <div id="responses-div" style="margin-top: 80px;">
    <h2 id="responses-div1"> Thank You for attempting this test !!! </h2>
  </div>
</template>

<script>
export default {
  name: 'ThankYou',
  data() {
    return {
      
    };
  },
  beforeRouteLeave(to, from, next) {
    next(false);
  },
  props: {
    
  },
  components: {
    
  },
  mounted() {
    
  },
  methods: {
    
  }
}
</script>