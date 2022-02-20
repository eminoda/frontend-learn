import Vue from "vue";
import App from "./App.vue";

import "vant/lib/index.css";
import { Button, Cell, Tag, Col, Row } from "vant";

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Cell);
Vue.use(Tag);
Vue.use(Col);
Vue.use(Row);
new Vue({
  render: (h) => h(App),
}).$mount("#app");

// app.use(Button);

// app.$mount("#app");
