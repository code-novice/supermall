<template>
  <nav-bar>
    <div slot="center" class="title">
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div v-for="(item,index) in titles" class="title-item"
           :class="{active:currentIndex==index}" @click="betailClick(index)">
        {{item}}
      </div>
    </div>
  </nav-bar>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";

  export default {
    name: "DetailNavBar",
    components:{
      NavBar
    },
    data(){
      return{
        titles:['商品','参数','评论','推荐'],
        currentIndex:0
      }
    },
    methods:{
      betailClick(index){
        this.currentIndex = index;
        this.$emit('titleClick', index)
      },
      backClick(){
        this.$router.back()
      }
    }
  }
</script>

<style scoped>
  .title{
    display: flex;
  }
.title-item {
  flex: 1;
  font-size: 13px;
}
.back img{
  margin-left: -55px;
  margin-top: 12px;
}
  .active{
    height: 40px;
    color: red;
    border-bottom: 1px solid red;

  }
</style>
