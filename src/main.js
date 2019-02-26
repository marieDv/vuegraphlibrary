// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueThreejs from 'vue-threejs'

window.TSNE = require('tsne-js');
window.THREE = require('THREE');
window.OrbitControls = require('three-orbitcontrols');
// window.TrackballControls = require('three-trackballcontrols');


Vue.use(VueThreejs)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
