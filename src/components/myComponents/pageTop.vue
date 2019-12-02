<template>
  <div class="page-top overflow-hidden">
    <h3 class="title pull-left" v-text="title"></h3>
    <slot></slot>
    <ol class="breadcrumb pull-right">
      <template v-for="(item, index) in $store.state.pageTopData">

          <li class="breadcrumb-item" :class="{'active': index + 1 == $store.state.pageTopData.length}" :key="index" v-if="index + 1 != $store.state.pageTopData.length">
            <router-link :to="{ path:item.router }">
            <a href="javascript:;" v-text="item.text"></a>
            </router-link>
          </li>
          <li class="breadcrumb-item active" v-else :key="index">
            <router-link :to="{ path:item.router }">
            <a href="javascript:;" v-text="item.text"></a>
            </router-link>
          </li>
      </template>
    </ol>
  </div>
</template>

<script>
export default {
  name: "PageTop",
  props: {
    title: {
      type: String,
      default: "标题"
    }
    // breadNav: {
    //   type: Array,
    //   default: () => this.$store.state.pageTopData
    // }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss">
.page-top {
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  .title {
    font-weight: 400;
    font-size: 24px;
  }
  .el-button {
    padding: 8px 20px;
    font-size: 12px;
    margin-left: 16px;
  }
  .breadcrumb {
    .breadcrumb-item {
      a {
        text-decoration: none;
        &:hover {
          text-decoration: none;
        }
      }
    }
  }
}
</style>
