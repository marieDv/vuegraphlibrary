<template>
    <div id="container">
        <!--<textlabels></textlabels>-->
        <!--v-on:scroll="remapTextlabels" v-on:click="remapTextlabels"-->
    </div>
</template>

<script>
    import * as Three from 'three'
    import Model from './Textlabels'
    import json from '../data/colors.json'
    //    import imageOne from '../assets/leaves/iPAD2_C01_EX01_B.TIFF'

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
                error: "",
                iteration: ""

            }
        },
        props: {
            inputJSON: {},
            modelColor: {default: "#a2a2a2", type: String},
            dim: {default: 1, type: Number},
            perplexity: {default: 50, type: Number},
            earlyExaggeration: {default: 4.0, type: Number},
            learningRate: {default: 100.9, type: Number},
            nIter: {default: 3500, type: Number},
            metric: {default: "euclidean", type: String},
            hasImages: {default: false, type: Boolean},
            labels: {default: null,type: Array}
        },
        methods: {
            init: function () {
                let container = document.getElementById('container');

//                this.camera = new Three.PerspectiveCamera(190, container.clientWidth / container.clientHeight, 0.002, 2000);
                this.camera = new THREE.PerspectiveCamera(100, container.clientWidth / container.clientHeight, 0.00002, 800);

                this.camera.position.z = 40;
                this.camera.rotation.x = 1.5;
                this.scene = new Three.Scene();

                var light = new THREE.AmbientLight('#fff', 1.7); // soft white light
                this.scene.add(light);

                var light = new THREE.PointLight(0xffffff, 1, 100);
                light.position.set(0, -1, 1);
                light.castShadow = true;


                var sphereSize = 1;
                var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);

                this.scene.add(light);

                this.renderer = new Three.WebGLRenderer({antialias: true});
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                this.renderer.setClearColor("#1d1d1d", 1);

                const controls = new OrbitControls(this.camera, this.renderer.domElement);
                controls.enableDamping = false;
                controls.dampingFactor = 0.85;
                controls.enableZoom = true;
                controls.maxDistance = 20;

                container.appendChild(this.renderer.domElement);

            },
            animate: function () {
                setTimeout(() => {
//                    this.pointsContainer.rotation.y += 52;
//                    this.pointsContainer.rotation.z += 52;
                    if(this.labels != null){this.remapTextlabels();}
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

                var box = document.getElementById("textbox");
                for (let i = 0; i < this.labels.length; i++) {
                    let label = document.createElement('p');
                    label.innerHTML += this.labels[i] + "</br>";
                    console.log(this.pointsContainer)
                    setTimeout(() => {
                        let currentPos = (this.toScreenPosition(this.pointsContainer.children[i], this.camera));
                        label.style.marginTop = (currentPos.y + container.clientHeight /2) + "px";
                        label.style.marginLeft = ((currentPos.x) * 2 + container.clientWidth /2) + "px";
                        box.appendChild(label);
                    }, 200)
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

            mapImages(i, material) {
                var loader = new THREE.TextureLoader();
                loader.load(
                    i < 9 ? require('../assets/leaves/png/iPAD2_C0' + (i + 1) + '_EX01_B.png') : require('../assets/leaves/png/iPAD2_C' + (i + 1) + '_EX01_B.png'),//../assets/leaves/iPAD2_C0\' + i + \'_EX04_B.TIFF'
                    function (texture) {

                        texture.repeat.set(1, 1);
                        material = new THREE.MeshStandardMaterial({
                            flatshading: true,
                            map: texture
                        });
                        setTimeout(() => {
                            return material;
                        }, 300)

                    },
                );
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
                model.run();
                model.rerun();
                let output = model.getOutput();

                this.tsneInputData = output;

                setTimeout(() => {
                    var geometry = new THREE.BufferGeometry();
                    var vertices = new Float32Array([
                        -1, -1, 1,
                        1, -1, 1,
                        1, 1, 1,

                        1, 1, 1,
                        -1, 1, 1,
                        -1, -1, 1
                    ]);
                    var uvs = new Float32Array([
                        0, 0, 0.9,
                        0.9, 0, 0.9,
                        0.9, 0.9, 0.9,

                        0.9, 0.9, 0.9,
                        0, 0.9, 0.9,
                        0, 0, 0.9
                    ])
                    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 3))
                    geometry.computeVertexNormals()

                    for (let i = 0; i < this.tsneInputData.length; i++) {
                        let material;
                        if (this.hasImages) {
                            var loader = new THREE.TextureLoader();
                            loader.load(
                                i < 9 ? require('../assets/leaves/png/iPAD2_C0' + (i + 1) + '_EX01_B.png') : require('../assets/leaves/png/iPAD2_C' + (i + 1) + '_EX01_B.png'),//../assets/leaves/iPAD2_C0\' + i + \'_EX04_B.TIFF'
                                function (texture) {

                                    texture.repeat.set(1, 1);
                                    material = new THREE.MeshStandardMaterial({
                                        flatshading: true,
                                        map: texture
                                    });
                                    setTimeout(() => {
                                        return material;
                                    }, 300)

                                },
                            );
                        } else {
                            material = new THREE.MeshStandardMaterial({color: this.modelColor, flatShading: true});
                        }
                        setTimeout(() => {

                            var sphere = new THREE.Mesh(geometry, material);


                            sphere.position.set(this.tsneInputData[i][0] * 40000, this.tsneInputData[i][1] * 40000, this.tsneInputData[i][2] * 40000)
                            this.pointsContainer.add(sphere);
                        }, 400);

                    }
                    this.pointsContainer.position.z -= 5;
                    this.scene.add(this.pointsContainer);//pointsContainer ist ein globales 3D-Objekt in das die Datenpunktobjekte gespeichert werden.
                    setTimeout(() => {
                        if (this.labels != null) {
                            this.createTextLabels()
                        }
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

        },
        install(Vue, options) {
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