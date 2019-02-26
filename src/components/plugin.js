import Model from './Model.vue';

module.exports = {
    install: function (Vue, options) {
        Vue.component('t-sne3d', Model);
    }
};