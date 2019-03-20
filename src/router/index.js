import Vue from 'vue'
import Router from 'vue-router'
import Model from '@/components/Tsne-three'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Model',
      component: Model
    }
  ]
})
