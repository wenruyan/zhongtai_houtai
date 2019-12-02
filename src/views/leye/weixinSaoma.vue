<template>
  <div class="main-content weixin-saoma">
    <div class="panel">
        <div class="title">微信扫码支付</div>
        <div class="line"></div>
        <div class="content-box">
            <div class="left-box">
                <div>
                    <span class="money">支付金额: </span>
                    <span class="monet-text">{{rechargeMoney}}</span>
                </div>
                <div class="s-text">收款方：孚库（上海）网络科技有限公司</div>
                <img class="imgurl" :src="imgUrl" alt="">
                <div class="b-box">
                    <div style="color:#387DFF;cursor: pointer;font-size: 14px;" @click="play">我已支付</div>
                    <div style="cursor: pointer;font-size: 14px;">支付遇到问题?</div>
                </div>
            </div>
            <div class="right-box">
                <img class="saoma-img" src="../../assets/img/saoma-explain.png" alt="">
                <div style="font-size:14px;">使用微信APP扫码完成支付</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rechargeMoney: "",
      rechargePoints: "",
      rechargeId: "",
      swiftNumber: "",
      loading: false,
      imgUrl: "",
      timer: "",
      lastTime: null,
      timeOut: 10 * 60 * 1000, // 设置超时时间： 10分钟
      currentTime: null
    };
  },
  created() {
    this.currentTime = new Date().getTime(); // 网页第一次打开时，记录当前时间
    console.log(this.currentTime, "currentTime");
  },
  mounted() {
    this.rechargeMoney = this.formatNum(
      this.$route.params.rechargeMoney.toString(),
      0
    );
    this.getCode();
    this.timer = setInterval(() => {
      setTimeout(this.checkPay(0), 0);
    }, 2000);
    this.lastTime = new Date().getTime(); // 网页第一次打开时，记录当前时间
    console.log(this.lastTime, "lastTime");
  },
  destroyed() {
    // 销毁定时器
    clearInterval(this.timer);
  },
  computed: {},
  watch: {},
  methods: {
    getCode() {
      let param = {
        rechargeId: this.$route.params.rechargeId,
        swiftNumber: this.$route.params.swiftNumber,
        payMethod: 40
      };
      this.$http
        .post("/focus.pcStartPay", param)
        .then(res => {
          if (res.code == 200) {
            this.imgUrl = res.data;
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    play() {
      clearInterval(this.timer);
      this.checkPay(1);
    },
    checkPay(status) {
      console.log(status, "status");
      this.lastTime = new Date().getTime();
      console.log(this.lastTime, "lastTime");
      if (this.lastTime - this.currentTime > this.timeOut) {
        clearInterval(this.timer);
      } else {
        this.lastTime = new Date().getTime();
      }
      let data = {
        rechargeId: this.$route.params.rechargeId,
        swiftNumber: this.$route.params.swiftNumber,
        hideError: true
      };
      console.log(data, "data");
      this.$http
        .post("/focus.selectPcWxPayResult", data)
        .then(res => {
          console.log(9999999);
          console.log(res, "res");
          if (res.code == 200) {
            clearInterval(this.timer);
            this.PUSH({
              name: "main-leye-palyResult",
              params: {
                rechargeMoney: this.rechargeMoney,
                rechargeId: this.$route.params.rechargeId,
                swiftNumber: this.$route.params.swiftNumber,
                showSuccess: true
              }
            });
          }
          if (status == 1) {
            if (res.code != 200) {
              this.PUSH({
                name: "main-leye-palyResult",
                params: {
                  rechargeMoney: this.rechargeMoney,
                  rechargeId: this.$route.params.rechargeId,
                  swiftNumber: this.$route.params.swiftNumber,
                  showSuccess: false
                }
              });
            }
          }
        })
        .catch(err => {
          console.log("err", err);
          console.log(11111111);
          if (status == 1) {
            this.PUSH({
              name: "main-leye-palyResult",
              params: {
                rechargeMoney: this.rechargeMoney,
                rechargeId: this.$route.params.rechargeId,
                swiftNumber: this.$route.params.swiftNumber,
                showSuccess: false
              }
            });
          }
        });
    }
  }
};
</script>

<style lang="scss">
.weixin-saoma {
  .panel {
    width: 1200px;
    .title {
      font-size: 24px;
      color: #091d40;
      margin-bottom: 20px;
      font-weight: bold;
      padding-top: 24px;
      padding-left: 30px;
    }
    .line {
      border-bottom: 1px solid #dde7ff;
    }
    .content-box {
      padding-top: 50px;
      padding-left: 250px;
      padding-right: 250px;
      justify-content: space-between;
      display: flex;
      .left-box {
        width: 320px;
        text-align: center;
        .money {
          color: #091d40;
          font-size: 24px;
          font-weight: bold;
        }
        .monet-text {
          color: #ff4343;
          font-size: 24px;
          font-weight: bold;
        }
        .s-text {
          color: #999;
          font-size: 12px;
          margin-top: 10px;
          margin-bottom: 22px;
        }
        .imgurl {
          width: 320px;
          height: 320px;
        }
        .b-box {
          padding: 0 54px;
          display: flex;
          justify-content: space-between;
        }
      }
      .right-box {
        text-align: center;
        padding-top: 122px;
        .saoma-img {
          width: 230px;
          height: 230px;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
