<template>
  <div class="demo-container">
    <button @click='buy(0.01)'>支付0.01元</button>
    <button @click='buy(0.02)'>支付0.02元</button>
    <button @click='buy(0.1)'>支付0.1元</button>
  </div>
</template>

<script>
import { getPayParams } from "./wenkong/api";
import Store from "./wenkong/store";

export default {
  methods: {
    buy(price) {
      const attach = JSON.stringify({
        test: "可以在这里带上任何附加信息"
      });
      getPayParams({
        openId: "oOSkz0fTjfcL-DHr4YNrsABdRFKU", // openId
        price: price*100, // 钱（不知道为什么要乘以100，之前项目说过为啥但我忘了）
        orderBodyDesc: "订单主体描述test",
        orderDetail: "订单详细描述test",
        attach: attach
      })
        .then(res => {
          this.invokeWXPay(
            res.data.appId,
            res.data.timeStamp,
            res.data.nonceStr,
            res.data.package1,
            res.data.signType,
            res.data.paySign
          );
        })
        .catch(err => {
          console.log(3, err);
        });
    },
    /**
     * 唤起微信支付
     * @param appId  公众号名称
     * @param timeStamp 时间戳
     * @param nonceStr 随机串
     * @param packageArg 订单详情扩展字符串
     * @param signType 微信签名方式
     * @param paySign 微信签名
     * @author shuiRong
     */
    invokeWXPay(appId, timeStamp, nonceStr, packageArg, signType, paySign) {
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: appId,
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: packageArg,
          signType: signType,
          paySign: paySign
        },
        res => {
          console.log("1", res);
          /** 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 */
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            /** 设置价格为-1，页面就会显示“已付费” */
          }
        },
        err => {
          console.log("2", err);
        }
      );
    }
  }
};
</script>
<style  lang="scss" scoped>
.demo-container {
  margin: 30% auto;
}
</style>

