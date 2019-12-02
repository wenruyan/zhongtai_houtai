<template>
  <div class="main-content rechargePay">
    <div class="panel">
        <div class="title">充值支付</div>
        <div class="line"></div>
        <div class="content-box">
            <div class="info-title">您的赞积分账户充值信息如下：</div>
            <div style="display:flex;margin-bottom:30px;">
              <div class="info-text">充值金额: <span style="color:#387DFF">{{rechargeMoney}} 元</span></div>
              <div class="info-text">对应积分：<span style="color:#387DFF">{{rechargePoints}}</span></div>
            </div>
            <div class="info-text">充值流水号：<span style="color:#333">{{swiftNumber}}</span></div>
            <el-tabs type="border-card">
                <el-tab-pane label="第三方支付">
                    <!-- <div class="weixin" @click="getCode">微信支付</div> -->
                    <img class="weixin" src="../../assets/img/weixin.png" alt="" @click="getCode">
                </el-tab-pane>
                <el-tab-pane label="线下支付">
                  <p class="info">银行转账信息</p>
                  <div class="text-box">
                    <p class="text1">公司名称: </p>
                    <p class="text2">孚库（上海）网络科技有限公司</p>
                  </div>
                  <div class="text-box">
                    <p class="text1">开户银行: </p>
                    <p class="text2">中国建设银行股份有限公司上海长逸路支行</p>
                  </div>
                  <div class="text-box">
                    <p class="text1">银行账号: </p>
                    <p class="text2" style="font-weight: bold;">3105 0184 3900 0000 0627 </p>
                  </div>
                  <div class="text-box">
                    <p class="text1">税号: </p>
                    <p class="text2">91310113MA1GMKP82B</p>
                  </div>
                  <div class="text-box">
                    <p class="text1">联系地址: </p>
                    <p class="text2">上海市宝山区逸仙路 2816号1幢22楼B2203-2204室</p>
                  </div>
                  <div class="text-box">
                    <p class="text1">联系电话: </p>
                    <p class="text2">(021) 6055 5988 </p>
                  </div>
                </el-tab-pane>
            </el-tabs>
            <p class="last-text">* 若现在无法完成付款，可至<span style="color:#387DFF;cursor: pointer;" @click="goDuizhang">对账明细</span>菜单中，再次发起支付</p>
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
      swiftNumber: "",
      loading: false
    };
  },
  mounted() {
    console.log(this.$route.params, "9999999");
    let param = {
      rechargeId: this.$route.params.rechargeId
    };
    this.loading = true;
    this.$http
      .post("/focus.pointsRechargeDetail", param)
      .then(res => {
        if (res.code == 200) {
          this.rechargeMoney = this.formatNum(
            (res.data.rechargeMoney / 100).toString()
          );
          this.rechargePoints = res.data.rechargePoints;
          this.swiftNumber = res.data.swiftNumber;
          this.loading = false;
        }
      })
      .catch(err => {
        console.log("err", err);
      });
  },
  computed: {},
  watch: {},
  methods: {
    getCode() {
      this.PUSH({
        name: "main-leye-weixinSaoma",
        params: { rechargeId: this.$route.params.rechargeId, swiftNumber: this.swiftNumber, rechargeMoney: this.rechargeMoney }
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
.rechargePay {
  .panel {
    width: 1200px;
    .title {
      font-size: 24px;
      color: #091D40;
      margin-bottom: 20px;
      font-weight: bold;
      padding-top: 24px;
      padding-left: 30px;
    }
    .line {
      border-bottom: 1px solid #DDE7FF;
    }
    .content-box {
      padding: 50px;
      .info-title {
        font-size: 18px;
        line-height: 25px;
        color: #666;
        font-weight: bold;
        margin-bottom: 30px;
      }
      .info-text {
        font-size: 14px;
        color: #666;
        width: 450px;
      }
      .el-tabs {
        width: 800px;
        height: 350px;
        margin-top: 44px;
        .el-tabs__content {
          padding: 40px 0 40px 50px;
          .info {
            font-size: 16px;
            color: #333;
            font-weight: bold;
          }
          .text-box {
            display: flex;
            line-height: 35px;
          }
          .text1 {
            color: #666;
            font-size: 14px;
          }
          .text2 {
            color: #333;
            font-size: 14px;
            margin-left: 10px;
          }
        }
      }
      .weixin {
        cursor: pointer;
        width: 200px;
        height: 66px;
      }
      .last-text {
        font-size: 14px;
        color: #999;
        margin-top: 30px;
      }
    }
  }
}
</style>
