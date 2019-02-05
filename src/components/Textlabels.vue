<template>
    <div></div>
</template>

<script>
    import * as Three from 'three'
    import json from '../data/colors.json'

    export default {
        name: 'TextLabels',
        data() {
            return {

            }
        },
        props: {
            inputJSON: {},
            dataKey: {default: "name"},
        },
        created() {
            window.addEventListener('mousewheel', this.remapTextlabels);
        },
        destroyed() {
            window.removeEventListener('mousewheel', this.remapTextlabels);
        },
        methods: {
            handleScroll: function () {

            },

            createTextLabels() {
//                dataKey inputJSON
                var box = document.getElementById("textbox");
                let jsonKeys = Object.values(this.inputJSON);
//                let parsedJson = JSON.parse(this.inputJSON);
                for (let i = 0; i < jsonKeys.length; i++) {
                    let label = document.createElement('p');
                    let localKey = toString(this.dataKey);//TODO: key replacement
                    console.log(jsonKeys[i])
                    label.innerHTML = jsonKeys[i].population;
//                    label.style.marginTop = "50px";
                    label.style.marginTop = ((this.pointsContainer.children[i].position.y * -457 + window.innerHeight / 2) * 1) + "px";
                    label.style.marginLeft = ((this.pointsContainer.children[i].position.x * 970 + window.innerWidth / 2) * 1) + "px";
                    box.appendChild(label);
                }


            },
            remapTextlabels() {
                console.log("remap??")
                let children = document.getElementById("textbox").childNodes;
//                console.log(children[0])

//                this.pointsContainer.geometry.verticesNeedUpdate = true;
                for (let i = 0; i < this.pointsContainer.children.length; i++) {
                    let vector = new THREE.Vector3();
                    vector.setFromMatrixPosition(this.pointsContainer.children[i].matrixWorld);
                    console.log(this.toScreenPosition(this.pointsContainer.children[i], this.camera).x);

                    this.pointsContainer.children[i].geometry.verticesNeedUpdate = true;
                    let calcs = (this.toScreenPosition(this.pointsContainer.children[i], this.camera));
                    children[i].style.marginTop = (this.toScreenPosition(this.pointsContainer.children[i], this.camera).y + window.innerHeight / 2) + "px";
                    children[i].style.marginLeft = ((calcs.x) * 2 + window.innerWidth / 2) + "px";
                    this.pointsContainer.updateMatrixWorld();
                    this.scene.updateMatrixWorld();

                }


            },

        },

        mounted() {
        }
    }
</script>

<style scoped>
</style>