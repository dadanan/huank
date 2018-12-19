<template>
  <div class="demo-container">
    <button @click='buy(0.01)'>支付0.01元</button>
    <button @click='buy(0.02)'>支付0.02元</button>
    <button @click='buy(0.1)'>支付0.1元</button>
  </div>
</template>

<script>
import { getPayParams } from "./wenkong/api";
import { pay } from "../utils/wx.js";
import Store from "./wenkong/store";

export default {
  methods: {
    buy(price) {
      const attach = JSON.stringify({
        test: "可以在这里带上任何附加信息"
      });
      getPayParams({
        openId: Store.fetch("Ticket"), // openId
        price: price * 100, // 钱（不知道为什么要乘以100，之前项目说过为啥但我忘了）
        orderBodyDesc: "订单主体描述test",
        orderDetail: "订单详细描述test",
        attach: attach
      })
        .then(res => {
          pay(
            res.appId,
            res.timeStamp,
            res.nonceStr,
            res.package1,
            res.signType,
            res.paySign
          );
        })
        .catch(err => {
          console.log(3, err);
        });
    }
  }
};
</script>
<style  lang="scss" scoped>
.demo-container {
  margin: 30% auto;
}
</style>

