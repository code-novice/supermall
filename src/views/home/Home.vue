<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick"
                 ref="tabControl1" v-show="isTabFixed"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll"
            :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <home-recommend-view :recommends="recommends"></home-recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick"
                   ref="tabControl2" v-show="!isTabFixed"/>
      <goods-list :goods="goods[currentType].list" />
    </scroll>

    <back-top @click.native="backClick" v-show="isShow"/>

  </div>
</template>

<script>

  import HomeSwiper from "./childComps/homeSwiper";
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import {getHomeMultidata,getHomeGoods} from 'network/home'
  import {debounce} from "common/utils";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      HomeRecommendView,
      FeatureView,
      TabControl,
      getHomeGoods,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        // result: [],
        banners:[],
        isShow:false,
        recommends: [],
        goods:{
          'pop': {page:0, list: []},
          'new': {page:0, list: []},
          'sell': {page:0, list: []}
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted(){


      const refresh = debounce(this.$refs.scroll.refresh,200)
      //3.监听item中图片加载完成
      this.$bus.$on('itemImageLoad', () =>{
        //刷新scroll高度
        // this.$refs.scroll.scroll.refresh()
        // this.$refs.scroll.refresh()
        //防抖动节流
        refresh()
      })
    },

    activated() {
      console.log('activated');
      this.$refs.scroll.scroll.scrollTo(0,this.saveY)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      console.log('deactivated');
      this.saveY = this.$refs.scroll.scroll.y
    },
    methods: {
      //网络请求相关方法
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          // this.result = res
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page +1
        getHomeGoods(type, page).then(res =>{
         this.goods[type].list.push(...res.data.list)
          console.log(type);
          this.goods[type].page += 1;

          this.$refs.scroll.scroll.finishPullUp();
          //刷新scroll高度
          // this.$refs.scroll.scroll.refresh()
        })
      },
      //事件监听方法
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        };
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },

      //回到顶部
      backClick() {
        this.$refs.scroll.scroll.scrollTo(0,0,500)
      },
      //实时监听滚动条位置
      contentScroll(position){
        //判断BackTop是否显示
        this.isShow =  position.y < -1000
        //觉得tabControl是否吸顶
        this.isTabFixed = -position.y > this.tabOffsetTop
      },
      //上拉加载更多
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      //获取tabControl的offsetTop
      //所有的组件都有一个属性$el,用于获取组件中的元素
      swiperImageLoad(){
       this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    color: #f6f6f6;
    background-color: var(--color-tint);

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  /*定位解决页面高度*/
  /*.content {*/
  /*  !*height: calc(100% - 49px);*!*/
  /*  overflow: hidden;*/
  /*  position: absolute;*/
  /*  top: 44px;*/
  /*  bottom: 49px;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*}*/
  /*calc方式解决页面高度*/
  .content {
    height: calc(100% - 49px);
    overflow: hidden;
    /*margin-top: 44px;*/
  }
</style>
