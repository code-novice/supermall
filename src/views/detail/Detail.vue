<template>
  <div id="detail">
   <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
    <detail-swiper :topImages="topImages"/>
    <detail-base-info :goods="goods"></detail-base-info>
    <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :commentInfo="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommends"/>
    </scroll>
    <detail-bottom-bar/>

    <back-top @click.native="backTop" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";

import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import {getDetail, GoodsInfo, Shop, GoodsParam, getRecommend} from "../../network/detail";
import {itemListenerMixin} from "../../common/mixin";

import Scroll from "../../components/common/scroll/Scroll";
import GoodsList from "../../components/content/goods/GoodsList";
import BackTop from "../../components/content/backTop/BackTop";

export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      BackTop
    },
    mixins: [itemListenerMixin],
  data(){
      return {
        iid: null,
        topImages: null,
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs:[],
        currentIndex: 0,
        isShowBackTop: false
      }
    },
    created() {
      //1.保存传入的id
      this.iid = this.$route.params.id

      //2.根据id请求详情页数据
      getDetail(this.iid).then(res => {
        //1.获取顶部的图片轮播数据
        const data = res.result
        this.topImages = data.itemInfo.topImages

        //2.获取商品信息
        this.goods = new GoodsInfo(data.itemInfo, data.columns, data.shopInfo.services)

        //3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        //4.获取商品详细信息
        this.detailInfo = data.detailInfo

        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //6.评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }

        //当渲染结束后会回调该函数(图片还没加载完,所以可能还是错误数据)
      //   this.$nextTick(() => {
      //     this.themeTopYs = [];
      //     this.themeTopYs.push(0)
      //     this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //     this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      //   })
      })

      //3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

    },

    mounted() {

    },

  destroyed() {
    this.$bus.$off('detailItemImageLoad', this.itemImgListener )
  },
  methods:{
    imageLoad(){
      this.$refs.scroll.refresh()
      this.themeTopYs = [];
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
    },
    titleClick(index){
      this.$refs.scroll.scroll.scrollTo(0,-this.themeTopYs[index],500)
    },
    contentScroll(position){
      //1.获取y值
     const positionY = -position.y

      //2.positionY和主题中值进行对比
      let length = this.themeTopYs.length;
      for(let i = 0;i < length;i++){
        if(this.currentIndex !== i && ((i < length -1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
          || (i === length -1 && positionY >= this.themeTopYs[i]))){
          this.currentIndex = i;
          console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      //3.是否显示回到顶部
      this.isShowBackTop = -position.y > 1000
    },
    backTop() {
        this.$refs.scroll.scroll.scrollTo(0,0,500)
    }
  }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 10;
    background-color: #fff;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px);
  }
</style>
