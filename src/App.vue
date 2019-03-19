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
    </div>
</template>

<script>
    import Model from './components/Model'
    import sparsematrix from './data/test.json'
    import leaves from './data/csvjson.json'



    export default {
        name: 'App',
        components: {
            Model
        },
        data() {
            return {
                definedDim: 3,
                definedPerplexity: 29,
                definedEarlyExaggeration: 1.0,
                definedLearningRate: 300.0,
                definedNIter: 220,
                definedMetric: "euclidean",
                color: '#4286f4',
                currentName: ["label"],
                jsonFile: leaves,
                leaveNames: ["Quercus suber", "Salix atrocinerea", "Populus nigra","Alnus sp", "Quercus robur", " Crataegus monogyna"," Ilex aquifolium", "Nerium oleander", "Betula pubescens","Tilia tomentosa", "Acer palmaturu", "Celtis sp",
                    "Corylus avellana", "Castanea sativa", "Populus alba"," Primula vulgaris", "Erodium sp", "Bougainvillea sp","Arisarum vulgare", "Euonymus japonicus", " Ilex perado ssp azorica",
                    "Magnolia soulangeana", "Buxus sempervirens", "Urtica dioica","Podocarpus sp", " Acca sellowiana", "Hydrangea sp","Pseudosasa japonica", "Magnolia grandiflora", "Geranium sp"]
            }
        },
    }
</script>

<style>
    #tsne-three {
        background: linear-gradient(9deg, rgb(6, 6, 6) 0%, rgb(35, 35, 36) 100%);
        background: blue;
    }
    #tsnethree-text {
        color: #ffdbe1;
        font-weight: 700;
        font-family: "Roboto Mono";
        letter-spacing: 1.2px;
        text-transform: uppercase;
    }
</style>
