<template>
    <div id="app">
        <model v-bind:inputJSON="jsonFile"
               v-bind:modelColor="color"
               v-bind:dim="definedDim"
               v-bind:perplexity="definedPerplexity"
               v-bind:earlyExaggeration="definedEarlyExaggeration"
               v-bind:learningRate="definedLearningRate"
               v-bind:nIter="definedNIter"
               v-bind:metric="definedMetric"
               v-bind:hasImages=true
               v-bind:labels="leaveNames"
        >
        </model>
        <!--v-bind:labels="leaveNames"-->

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
                definedPerplexity: 31,
                definedEarlyExaggeration: 1,
                definedLearningRate: 500.0,
                definedNIter: 220,
                definedMetric: "euclidean",
                color: '#4286f4',
                currentName: ["label"],
                jsonFile: csv,
                leaveNames: ["Quercus suber", "Salix atrocinerea", "Populus nigra","Alnus sp", "Quercus robur", " Crataegus monogyna"," Ilex aquifolium", "Nerium oleander", "Betula pubescens","Tilia tomentosa", "Acer palmaturu", "Celtis sp",
                    "Corylus avellana", "Castanea sativa", "Populus alba"," Primula vulgaris", "Erodium sp", "Bougainvillea sp","Arisarum vulgare", "Euonymus japonicus", " Ilex perado ssp azorica",
                    "Magnolia soulangeana", "Buxus sempervirens", "Urtica dioica","Podocarpus sp", " Acca sellowiana", "Hydrangea sp","Pseudosasa japonica", "Magnolia grandiflora", "Geranium sp"]
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
        color: #1738ff;
        font-family: "Montserrat";
        text-transform: uppercase;
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
