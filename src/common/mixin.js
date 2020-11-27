import {debounce} from "./utils";

export const itemListenerMixin = {
  data(){
    return {
      itemImgListener: null
    }
  },
  mounted() {
    let newRefresh = debounce(this.$refs.scroll.refresh, 100)
    this.itemImgListener = () =>{
      newRefresh()
    }
    this.$bus.$on('detailItemImageLoad', this.itemImgListener )
    console.log('我说混入中的内容');
  }
}
