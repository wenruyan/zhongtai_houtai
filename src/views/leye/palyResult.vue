<template>
  <div class="main-content palyResult">
    <div class="panel">
        <div class="title">积分充值</div>
        <div class="line"></div>
        <div class="content-box" v-if="showSuccess">
            <img class="suc-img" src="../../assets/img/success.png" alt="">
            <div class="text">支付成功，您已经完成支付 <span style="color:#387DFF">{{rechargeMoney}}</span>元</div>
            <div class="btn-box">
               <el-button class="return-btn" type="primary" @click="goBack">返回</el-button>
               <el-button class="duizhang" type="primary" plain @click="goDuizhang">对账明细</el-button>
            </div>
            <div class="last-text">{{time}}秒后自动跳转至对账明细</div>
        </div>
        <div class="content-box" v-if="!showSuccess">
            <img class="suc-img" src="../../assets/img/fail.png" alt="">
            <div class="text text1">支付失败，没有查询到支付信息!</div>
            <div class="text text1">您的支付可能在途，请稍后去对账明细中查询。</div>
            <div class="btn-box">
               <el-button class="return-btn" type="primary" @click="goBack">返回</el-button>
               <el-button class="duizhang" type="primary" plain @click="goDuizhang">对账明细</el-button>
            </div>
            <div class="last-text">{{time}}秒后自动跳转至对账明细</div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rechargeMoney: "",
      showSuccess: "",
      time: 10,
      timer: null
    };
  },
  mounted() {
    this.showSuccess = this.$route.params.showSuccess;
    if (this.$route.params.rechargeMoney) {
      this.rechargeMoney = this.formatNum(
        this.$route.params.rechargeMoney.toString(),
        0
      );
    }

    this.intervalTime();
  },
  computed: {},
  watch: {},
  methods: {
    intervalTime() {
      if (this.time > 0) {
        this.time = this.time - 1;
        this.timer = setTimeout(() => {
          this.intervalTime();
        }, 1000);
        if (this.time == 0) {
          this.PUSH({
            name: "main-leye-recharge"
          });
        }
      } else {
        this.time = 4;
      }
    },
    goBack() {
      clearInterval(this.timer);
      this.PUSH({
        name: "main-leye-integralRecharge"
      });
    },
    goDuizhang() {
      this.PUSH({
        name: "main-leye-recharge"
      });
    }
  }
};
</script>

<style lang="scss">
.palyResult {
  .panel {
    width: 1200px;
    padding: 50px;
    .title {
      font-size: 16px;
      color: #333;
      margin-bottom: 10px;
    }
    .line {
      border-bottom: 1px solid #333;
    }
    .content-box {
      padding: 80px;
      text-align: center;
      .suc-img {
        width: 80px;
        height: 80px;
        margin-top: 48px;
        margin-bottom: 50px;
      }
      .text {
        color: #666;
        font-size: 18px;
        font-weight: bold;
      }
      .text1 {
        font-size: 16px;
      }
      .btn-box {
        margin-top: 24px;
        .return-btn {
          width: 110px;
          height: 36px;
          background: #387dff;
          margin-right: 30px;
        }
        .duizhang {
          width: 110px;
          height: 36px;
          background: #e5edff;
          color: #387dff;
          border: 1px solid #387dff;
        }
      }
      .last-text {
        color: #999;
        font-size: 12px;
        margin-top: 14px;
      }
    }
  }
}
</style>
