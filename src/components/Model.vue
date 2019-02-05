<template>
    <div v-on:scroll="remapTextlabels" v-on:click="remapTextlabels" id="container">
        <textlabels></textlabels>
    </div>
</template>

<script>
    import * as Three from 'three'
    import Model from './Textlabels'
    import json from '../data/colors.json'

    export default {
        name: 'Model',
        data() {
            return {
                camera: null,
                scene: null,
                once: false,
                renderer: null,
                mesh: null,
                pointsMaterial: null,
                pointsGroup: new THREE.Object3D(),
                once: false,
                pointsContainer: new THREE.Object3D(),
                tsneInputData: null,

            }
        },
        props: {
            inputJSON: {},
            dataKey: {default: "name"},
            modelColor: {default: "#a2a2a2"},
            dim: {default: 5},
            perplexity: {default: 50},
            earlyExaggeration: {default: 4.0},
            learningRate: {default: 100.9},
            nIter: {default: 3500,},
            metric: {default: "euclidean"}
        },
        methods: {
            init: function () {
                let container = document.getElementById('container');

                this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 1000);
                this.camera.position.z = 1;
                this.scene = new Three.Scene();

                var light = new THREE.AmbientLight('#fff', 0.7); // soft white light
                this.scene.add(light);

                var light = new THREE.PointLight(0xffffff, 1, 100);
                light.position.set(0, 10, 0);
                light.castShadow = true;            // default false
                this.scene.add(light);

                this.renderer = new Three.WebGLRenderer({antialias: true});
                this.renderer.setSize(container.clientWidth, container.clientHeight);

                const controls = new OrbitControls(this.camera, this.renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.25;
                controls.enableZoom = true;


                container.appendChild(this.renderer.domElement);

            },
            animate: function () {
                setTimeout(() => {
//                    this.pointsContainer.rotation.y += 0.002;
//                    this.pointsContainer.rotation.z += 0.002;
                    this.remapTextlabels();
                }, 1000 / 30);
                requestAnimationFrame(this.animate);

                this.renderer.render(this.scene, this.camera);

            },
            toScreenPosition(obj, camera) {
                var vector = new THREE.Vector3();
                var widthHalf = 0.5 * this.renderer.context.canvas.width;
                var heightHalf = 0.5 * this.renderer.context.canvas.height;

                obj.updateMatrixWorld();
                vector.setFromMatrixPosition(obj.matrixWorld);
                vector.project(camera);

                vector.x = ( vector.x * widthHalf ) + widthHalf;
                vector.y = -( vector.y * heightHalf ) + heightHalf;

                return {
                    x: vector.x,
                    y: vector.y
                };

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
                    label.innerHTML = jsonKeys[i].country;
//                    label.style.marginTop = "50px";
                    let calcs = (this.toScreenPosition(this.pointsContainer.children[i], this.camera));
                    label.style.marginTop = (this.toScreenPosition(this.pointsContainer.children[i], this.camera).y + window.innerHeight / 2) + "px";
                    label.style.marginLeft = ((calcs.x) * 2 + window.innerWidth / 2) + "px";
                    box.appendChild(label);
                }


            },
            remapTextlabels() {

                let children = document.getElementById("textbox").childNodes;
                for (let i = 0; i < this.pointsContainer.children.length; i++) {
                    let vector = new THREE.Vector3();
                    vector.setFromMatrixPosition(this.pointsContainer.children[i].matrixWorld);
                    this.pointsContainer.children[i].geometry.verticesNeedUpdate = true;
                    let calcs = (this.toScreenPosition(this.pointsContainer.children[i], this.camera));
                    children[i].style.marginTop = (this.toScreenPosition(this.pointsContainer.children[i], this.camera).y + window.innerHeight / 2) + "px";
                    children[i].style.marginLeft = ((calcs.x) * 2 + window.innerWidth / 2) + "px";
                    this.pointsContainer.updateMatrixWorld();
                    this.scene.updateMatrixWorld();

                }


            },
            createTsne() {

                let model = new TSNE({
                    dim: this.dim,
                    perplexity: this.perplexity,
                    earlyExaggeration: this.earlyExaggeration,
                    learningRate: this.learningRate,
                    nIter: this.nIter,
                    metric: this.metric
                });

                model.init({
                    data: this.inputJSON,
                    type: 'dense'
                });

                let output = model.getOutput();
                console.log(output)
                this.tsneInputData = output;

                setTimeout(() => {
                    let geometry = new Three.SphereGeometry(0.008, 0.008, 0.02);
                    let material = new Three.MeshPhongMaterial({color: this.modelColor});

                    for (let i = 0; i < this.tsneInputData.length; i++) {
                        var sphere = new THREE.Mesh(geometry, material);
                        sphere.position.set(this.tsneInputData[i][0] * 600, this.tsneInputData[i][1] * 600, this.tsneInputData[i][2] * 600)
                        sphere.geometry.verticesNeedUpdate = true;
                        sphere.matrixAutoUpdate = true;
                        this.pointsContainer.add(sphere);

                    }
                    this.scene.add(this.pointsContainer);
                    setTimeout(() => {
                        this.createTextLabels();
                    }, 200)
                }, 300)

            },

        },

        mounted() {

            this.init();
            this.once === false ? this.createTsne() : this.once = true;
            setTimeout(() => {
                this.animate();
            }, 1000 / 30)

        }
    }
</script>

<style scoped>
    #container {
        height: 100vh;
        top: 0;
        margin: 0;
    }
</style>