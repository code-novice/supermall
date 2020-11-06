<template>
  <div id="detail">
   <detail-nav-bar></detail-nav-bar>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";

import {getDetail} from "../../network/detail";

export default {
    name: "Detail",
    components:{
      DetailNavBar
    },
    data(){
      return {
        iid: null
      }
    },
    created() {
      //1.保存传入的id
      this.iid = this.$route.params.id

      //2.根据id请求详情页数据
      getDetail(this.iid).then(res => {
        console.log(this.iid);
        console.log(res);
      })
    }
  }
</script>

<style scoped>

</style>
