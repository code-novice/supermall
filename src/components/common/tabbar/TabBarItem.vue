<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <slot name="item-icon-active" v-else></slot>
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    props:{
      path: String,
      activeColor: {
        type: String,
        default: 'red'
      }
    },
    data(){
      return{
        // isActive: true
      }
    },
    methods: {
      itemClick(){
        this.$router.replace(this.path)
      }
    },
    computed:{
      isActive() {
        return this.$route.path == this.path
      },
      activeStyle(){
        return this.isActive ? {color:this.activeColor}: {}
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item {
    flex: 1; /*均等分*/
    text-align: center; /*水平居中*/
    height: 49px;
    font-size: 12px;
  }
  .tab-bar-item img{
    width: 24px;
    height: 24px;
  }
</style>
