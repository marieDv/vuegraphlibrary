<template>
    <div id="app">
        <!--<model v-bind:inputJSON="jsonFile"-->
               <!--v-bind:dataKey="currentName"-->
               <!--v-bind:modelColor="color"-->
               <!--v-bind:dim="definedDim"-->
               <!--v-bind:perplexity="definedPerplexity"-->
               <!--v-bind:earlyExaggeration="definedEarlyExaggeration"-->
               <!--v-bind:learningRate="definedLearningRate"-->
               <!--v-bind:nIter="definedNIter"-->
               <!--v-bind:metric="definedMetric">-->
        <!--</model>-->
        <div id="textbox"></div>
    </div>
</template>

<script>
    import Model from './components/Model'
    import json from './data/colors.json'
    import population from './data/density.json'
    import montlyWeatherData from './data/monthly_json.json'
    Vue.use(Model, {
        job: 'Web Dev'
    })
    export default {
        name: 'App',
        components: {
            Model
        },
        data() {
            return {
                definedDim: 5,
                definedPerplexity: 50, //tsne specific
                definedEarlyExaggeration: 4.0,
                definedLearningRate: 100.0,
                definedNIter: 4000,
                definedMetric: "euclidean",

                color: '#4286f4',
                currentName: "population",
                jsonFile: population,
                jsonArray:
                    [
                        {"firstName": "John", "lastName": "Doe"},
                        {"firstName": "Anna", "lastName": "Smith"},
                        {"firstName": "Peter", "lastName": "Jones"}
                    ]
            }
        },
        methods: {
            init() {
//                let jsonKeys = Object.values(this.jsonFile);
//                this.currentName = jsonKeys[2].country;
            }
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
