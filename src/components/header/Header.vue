<template>
  <!-- begin #header -->
  <div class="header">
    <div class="main-header flex flex-cross-center">
      <div class="logo" @click="goMywork">
        <img src="../../assets/img/login_logo.png" alt />
      </div>
      <div class="header-menu flex flex-cross-center">
        <div class="menu-item noselect menu-btn menu-span" v-for="(item, index) in menuList" :key="index">
          <span class="menu-btn menu-span" v-if="item.text" @click="clickMenu(item, index)">{{item.text}}</span>
          <img class="menu-btn menu-span" :src="item.img" alt v-else @click="clickMenu(item, index)" />
          <div
            class="dropdownMenu menu-btn menu-span"
            v-if="item.children && item.children.length > 0 && item.showDropMenu"
          >
            <div
              class="drop-item menu-btn menu-span"
              v-for="(item2, index2) in item.children"
              :key="index2"
              @click="clickMenu(item2)"
            >
              <i class="fa" :class="'fa-' + item2.icon" v-if="item2.icon"></i>
              {{item2.text}}
            </div>
          </div>
        </div>
      </div>
      <div class="company-info flex-1 t-r">
        <div class="company-name">
          <div class="menu-btn">
            <span class="menu-span"  @click="showCompanyMenu">{{$store.state.companyInfo.company}}</span>
          </div>
          <div class="dropdownMenu menu-btn" v-if="showCompanyDropMenu">
            <div class="drop-item menu-btn" @click="quit">
              <i class="fa fa-sign-out"></i>退出登录
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end #header -->
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      showCompanyDropMenu: false,
      menuList: [
        {
          text: "工作台首页",
          path: "/main/myWork"
        },
        {
          text: "编辑乐业卡",
          path: "/main/editInfo",
          query: { save: 1 }
        },
        {
          text: "员工管理",
          // path: "/main/staffManage",
          showDropMenu: false,
          children: [
            {
              text: "员工信息",
              path: "/main/staffManage",
              num: 1,
              isSave: "1"
            },
            {
              text: "员工审核",
              path: "/main/staffManage",
              num: 2,
              isSave: "1"
            }
          ]
        },
        {
          text: "积分管理",
          // path: "/main/staffManage",
          showDropMenu: false,
          children: [
            {
              text: "积分充值",
              path: "/main/integralRecharge",
              num: 1,
              isSave: "1"
            },
            {
              text: "积分发放",
              path: "/main/integralGrant",
              num: 2,
              isSave: "1"
            },
            {
              text: "积分发放查询",
              path: "/main/pointsQuery",
              num: 3,
              isSave: "1"
            },
            {
              text: "对账明细",
              path: "/main/recharge",
              num: 4,
              isSave: "1"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    document.addEventListener("click", e => {
      if (e.target.className.indexOf("menu-span") == -1) {
        this.hideAllDropMenu();
      }
    });
  },
  methods: {
    goMywork() {
      this.PUSH({
        name: "main-leye-myWork"
      });
    },
    clickMenu(data, index) {
      this.hideAllDropMenu();
      if (data.children && data.children.length > 0) {
        data.showDropMenu = !data.showDropMenu;
      } else if (data.opt == "click") {
        this[data.optFunc](data);
      } else {
        // this.PUSH(data.path);
        console.log(data, "data");
        let path = data.path;
        let query = data.query;
        if (data.isSave) {
          this.$store.commit("updateActiveIndex", data.num);
        }
        this.PUSH({ path, query });
      }
    },
    hideAllDropMenu() {
      this.showCompanyDropMenu = false;
      this.menuList.map(item => {
        item.showDropMenu = false;
      });
    },
    quit(data) {
      console.log("退出登录", data);
      window.localStorage.clear();
      this.REPLACE("/login");
    },
    showCompanyMenu() {
      this.hideAllDropMenu();
      this.showCompanyDropMenu = true;
    }
  }
};
</script>
<style lang="scss">
.header {
  width: 100%;
  height: 60px;
  background: rgba(14, 27, 49, 1);
  box-shadow: 0px 7px 16px rgba(5, 16, 91, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  color: #ffffff;
  z-index: 1;
  .main-header {
    width: 1200px;
    margin: 0 auto;
    // overflow: hidden;
    .logo {
      padding: 15px 0;
      margin-right: 84px;
      cursor: pointer;
      img {
        height: 30px;
        display: block;
      }
    }
    .header-menu {
      .menu-item {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        margin-left: 56px;
        padding: 15px 0;
        cursor: pointer;
        position: relative;
        & > span {
          display: block;
          height: 30px;
          line-height: 30px;
          &:hover {
            color: #9da5b3;
          }
        }
        & > img {
          display: block;
          height: 30px;
        }
        .dropdownMenu {
          padding: 5px 0;
          background-color: #ffffff;
          position: absolute;
          top: 60px;
          right: 0;
          border-radius: 5px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
          .drop-item {
            color: #333333;
            font-size: 16px;
            padding: 10px 30px;
            white-space: nowrap;
            font-weight: normal;
            &:hover {
              background-color: #f4f4f4;
            }
            .fa {
              margin-right: 10px;
            }
          }
        }
      }
    }
    .company-info {
      .company-name {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        margin-left: 56px;
        padding: 15px 0;
        cursor: pointer;
        position: relative;
        & > span {
          display: block;
          height: 30px;
          line-height: 30px;
          &:hover {
            color: #9da5b3;
          }
        }
        .menu-span:hover {
          color: #9da5b3;
        }
        .dropdownMenu {
          padding: 5px 0;
          background-color: #ffffff;
          position: absolute;
          top: 60px;
          right: 0;
          border-radius: 5px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
          .drop-item {
            color: #333333;
            font-size: 16px;
            padding: 10px 30px;
            white-space: nowrap;
            font-weight: normal;
            &:hover {
              background-color: #f4f4f4;
            }
            .fa {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
