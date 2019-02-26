<template>
    <div id="app">
        <model v-bind:inputJSON="jsonFile"
               v-bind:modelColor="color"
               v-bind:dim="definedDim"
               v-bind:dataKey="currentName"
               v-bind:perplexity="definedPerplexity"
               v-bind:earlyExaggeration="definedEarlyExaggeration"
               v-bind:learningRate="definedLearningRate"
               v-bind:nIter="definedNIter"
               v-bind:metric="definedMetric"
               v-bind:hasImages=true
        >
        </model>
        <!--<!--v-bind:dataKey="currentName"-->-->
        <div id="textbox"></div>
    </div>
</template>

<script>
    import Model from './components/Model'
    import json from './data/colors.json'
//    import mnist from './data/mnist_handwritten_test.json'
    import mnistSmall from './data/mnist_small.json'
//    import compressed from './data/mnist_compressed.json.gz'
    import test from './data/test.json'
    import digits from './data/digits.json'
    import population from './data/density.json'
    import csv from './data/csvjson.json'
    import montlyWeatherData from './data/monthly_json.json'


    export default {
        name: 'App',
        components: {
            Model
        },
        data() {
            return {
                definedDim: 3,
                definedPerplexity: 150,
                definedEarlyExaggeration: 1,
                definedLearningRate: 200.0,
                definedNIter: 320,
                definedMetric: "euclidean",
                color: '#4286f4',
                currentName: ["label"],
                jsonFile: csv,
                leaveNames: ["Quercus suber", "Salix atrocinerea", "Populus nigra","Alnus sp", "Quercus robur", " Crataegus monogyna"," Ilex aquifolium", "Nerium oleander", "Betula pubescens","Quercus suber", "", ""
                    "Quercus suber", "", "","Quercus suber", "", "","Quercus suber", "", ""
                    "Quercus suber", "", "","Quercus suber", "", "","Quercus suber", "", ""]
            }
        },
        methods: {
            init() {
//                let jsonKeys = Object.values(this.jsonFile);
//                this.currentName = jsonKeys[2].country;
            },
        },
        mounted(){
            this.init();

        },

    }
</script>

<style>
    #textbox {
        position: absolute;
        top: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        font-size: 0.1rem;
        color: #fff;
        text-align: center;
    }

    #textbox p {
        position: absolute;
        z-index: 5;
        margin-top: 50vh;
        left: -50vw;
        right: 0;

        top: -50vh;
        left: -150vw;
    }
</style>
