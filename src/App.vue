/*
* Vue.js Schnittstelle. Dieser Teil ist von Nutzerinnen abhängig und gehört nicht zu der Komponente
*/
<template>
  <div id="app">
      <!-- api for the plugin 
           alle Eigenschaften bis auf inputJSON können entfernt werden, ohne dass das Plugin seine Funktionalität verliert. 
           Allerdings können die Ergebnisse der Visualisierung darunter leiden
      -->
    <TsneThree
      v-bind:inputJSON="jsonFile"
      v-bind:modelColor="color"
      v-bind:dim="definedDim"
      v-bind:perplexity="definedPerplexity"
      v-bind:earlyExaggeration="definedEarlyExaggeration"
      v-bind:learningRate="definedLearningRate"
      v-bind:nIter="definedNIter"
      v-bind:metric="definedMetric"
      v-bind:imagePath="definedImagePath"
      v-bind:labels="leaveNames"
    ></TsneThree>
  </div>
</template>

<script>
import TsneThree from "./components/Tsne-three"; //import of the component
import sparsematrix from "./data/test.json"; //import of the data files
import leaves from "./data/csvjson.json";

export default {
  name: "App",
  components: {
    TsneThree
  },
  data() {
    return { //  Werte & Daten die an das Plugin übergeben werden
      definedDim: 3,
      definedPerplexity: 29,
      definedEarlyExaggeration: 1.0,// deaktiviert bei dem Wert 1.0
      definedLearningRate: 300.0,
      definedNIter: 220,
      definedMetric: "euclidean",
      definedImagePath: "leaves/png-color/iPAD2_C", // Pfad zu den Bilddaten root ist der assets folder (um die bw bilder zu testen pfad zu png-bw ändern)
      color: "#4286f4",
      currentName: ["label"],
      jsonFile: leaves,
      leaveNames: [
        "Quercus suber",
        "Salix atrocinerea",
        "Populus nigra",
        "Alnus sp",
        "Quercus robur",
        " Crataegus monogyna",
        " Ilex aquifolium",
        "Nerium oleander",
        "Betula pubescens",
        "Tilia tomentosa",
        "Acer palmaturu",
        "Celtis sp",
        "Corylus avellana",
        "Castanea sativa",
        "Populus alba",
        " Primula vulgaris",
        "Erodium sp",
        "Bougainvillea sp",
        "Arisarum vulgare",
        "Euonymus japonicus",
        " Ilex perado ssp azorica",
        "Magnolia soulangeana",
        "Buxus sempervirens",
        "Urtica dioica",
        "Podocarpus sp",
        " Acca sellowiana",
        "Hydrangea sp",
        "Pseudosasa japonica",
        "Magnolia grandiflora",
        "Geranium sp"
      ]
    };
  }
};
</script>
// außerhalb konfigurierbare css Eigenschaften
<style>
#tsne-three {
  background: linear-gradient(9deg, rgb(6, 6, 6) 0%, rgb(35, 35, 36) 100%);
  background: blue;
  width: 100%;
  height: 100vh;
}
#tsnethree-text {
  color: #ffdbe1;
  font-weight: 700;
  font-family: "Roboto Mono";
  letter-spacing: 1.2px;
  text-transform: uppercase;
}
</style>
