import Vue from 'vue'
import Page from './Index.vue'
import store from '../store'
import '../assets/tailwind.css'

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(Page)
}).$mount('#app');

