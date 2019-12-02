<template>
  <div class="use flex flex-cross-center" @mousemove="showUseContent" @mouseleave="hideUseContent">
    <div class="question-box flex flex-cross-center">
      <question-mark></question-mark>
      <span class="text">使用须知</span>
    </div>
    <div class="use-content" v-show="useContentShow">
      <div class="u-c-header flex flex-main-justify flex-cross-center">
        <h4>使用帮助</h4>
        <div class="download">
          <span class="el-icon-download"></span>
          <!-- <span>下载文件</span> -->
          <a
            href="../bpeClean/w00b/com.w00b.action.R64.downloadLeYePdf.bpe_json"
            download
            rel="noopener noreferrer"
            class="text-download"
          >下载文件</a>
        </div>
      </div>
      <div class="u-c-cont">
        <h5>一、如何在公众号创建企业自己的乐业卡</h5>
        <p>1、复制乐业卡链接</p>
        <p>2、登入公司公众号 点击登录，（这里使用自己公司公众号是超链接）选择功能-自定义菜单，添加一个自定义菜单设定菜单名称，设置菜单内容为跳转网页，页面地址中粘贴乐业卡链接。</p>
        <p>3、保存并发布。</p>
        <p>注：服务号需要认证才能填写哦！</p>
        <h5>二、如何使用“乐业权益”公众号登入乐业卡</h5>
        <p>1、通知企业员工关注“乐业权益”公众号。</p>
        <p>2、找到菜单中的“乐业卡”点击进行登录。</p>
      </div>
    </div>
  </div>
</template>

<script>
import questionMark from "./questionMark";
export default {
  data() {
    return {
      useContentShow: false,
      timer: "",
      downUrl: "@/static/shiyongxuzhi.pdf"
    };
  },
  components: { questionMark },
  methods: {
    hideUseContent() {
      this.timer = setTimeout(() => {
        this.useContentShow = false;
      }, 500);
    },
    showUseContent() {
      clearTimeout(this.timer);
      this.useContentShow = true;
    }
  },
  mounted() {
    this.$http
      .post("/focus.middleGroundParam", {
        companyNo: this.$store.state.userInfo.company_no
      })
      .then(res => {
        console.log("middleGroundParam", res);
        this.downUrl = res.data.noticeForUserUrl;
      })
      .catch(err => {
        console.log("err", err);
      });
  }
};
</script>

<style lang="scss">
h4,
h5 {
  font-weight: bold;
}
.use {
  position: relative;
  .question-box {
    cursor: pointer;
  }
  .text {
    font-size: 12px;
    color: #999;
    margin-left: 16px;
    font-weight: 500;
  }
  .use-content {
    position: absolute;
    right: 100%;
    top: 100%;
    width: 510px;
    height: 500px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 10px 10px rgba(5, 16, 91, 0.16);
    opacity: 1;
    z-index: 998;
    color: #091d40;
    border-radius: 10px;
    .u-c-header {
      padding: 32px 34px 20px 34px;
      border-bottom: 1px solid #dde7ff;
      line-height: 0;
      h4 {
        font-size: 20px;
      }
      div span,
      div a {
        color: #387dff;
        font-size: 12px;
        &:first-child {
          margin-right: 4px;
        }
      }
      .download {
        cursor: pointer;
        .text-download {
          color: #387DFF;
          &:hover {
            color: #9cbeff;
          }
        }
      }
    }
    .u-c-cont {
      padding: 30px 67px 148px 40px;
      h5 {
        font-size: 14px;
        margin-bottom: 20px;
        margin-top: 14px;
        &:first-child {
          margin-top: 0;
        }
      }
      p {
        font-size: 12px;
        margin-bottom: 26px;
      }
    }
  }
}
</style>
