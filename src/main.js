// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueThreejs from 'vue-threejs'
// import TSNE from 'tsne-js'
const TSNE = require('tsne-js');
window.TSNE = require('tsne-js');
const THREE = require('THREE');
window.THREE = require('THREE');
const OrbitControls = require('three-orbitcontrols');
window.OrbitControls = require('three-orbitcontrols');


Vue.use(VueThreejs)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
