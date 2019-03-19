<template>
    <div ref="tsnethree" id="tsne-three">
         <div ref="textlabels" id="tsnethree-text"/>
    </div>
</template>

<script>
    import * as Three from 'three'

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
                pointsGroup: new Three.Object3D(),
                once: false,
                pointsContainer: new Three.Object3D(),
                tsneInputData: null,
                error: "",
                iteration: "",
                windowparams: [{width: window.innerWidth, height: window.innerHeight}],

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

                this.camera = new Three.PerspectiveCamera(100, this.$refs.tsnethree.clientWidth / this.$refs.tsnethree.clientHeight, 0.00002, 12000);
                console.log(this.windowparams.height)
                this.camera.position.z = 200;
                this.camera.rotation.x = 1.5;
                this.scene = new Three.Scene();

                var light = new Three.AmbientLight('#fff', 1.7);
                this.scene.add(light);

                const color = "#c5c7cf";
                const near = 1;
                const far = 60;
                this.scene.fog = new Three.Fog(color, near, far);

                var light = new Three.PointLight("#f2242d", 1, 100);
                light.position.set(0, 6, 3);
                light.castShadow = true;

                this.scene.add(light);
                this.renderer = new Three.WebGLRenderer({antialias: true, alpha: true}, {alpha:true});
                this.renderer.setSize(this.$refs.tsnethree.clientWidth, this.$refs.tsnethree.clientHeight);

              const controls = new OrbitControls(this.camera, this.renderer.domElement);
                controls.enableDamping = false;
                controls.dampingFactor = 0.85;
                controls.enableZoom = true;

              this.$refs.tsnethree.appendChild(this.renderer.domElement);

            },
            animate: function () {
                setTimeout(() => {
                    if(this.labels != null){this.remapTextlabels();}
                }, 1000 / 30);
                requestAnimationFrame(this.animate);

                this.renderer.render(this.scene, this.camera);

            },
            toScreenPosition(obj, camera) {
                var vector = new Three.Vector3();
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
                for (let i = 0; i < this.labels.length; i++) {
                    let label = document.createElement('p');
                    label.innerHTML += this.labels[i] + "</br>";
                    console.log(this.pointsContainer)
                    setTimeout(() => {
                        let currentPos = (this.toScreenPosition(this.pointsContainer.children[i], this.camera));
                        label.style.marginTop = (currentPos.y + this.$refs.tsnethree.clientHeight /2) + "px";
                        label.style.marginLeft = ((currentPos.x) * 2 + this.$refs.tsnethree.clientWidth /2) + "px";
                        this.$refs.textlabels.appendChild(label);
                    }, 200)
                }
            },
            remapTextlabels() {
                let children = this.$refs.textlabels.childNodes;
                for (let i = 0; i < this.pointsContainer.children.length; i++) {
                    let vector = new Three.Vector3();
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
                model.run();
                model.rerun();
                let output = model.getOutput();

                this.tsneInputData = output;
                console.log(output)
                setTimeout(() => {
                    var geometry = new Three.BufferGeometry();
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
                    geometry.addAttribute('position', new Three.BufferAttribute(vertices, 3));
                    geometry.addAttribute('uv', new Three.BufferAttribute(uvs, 3))
                    geometry.computeVertexNormals()

                    for (let i = 0; i < this.tsneInputData.length; i++) {
                        let material;
                        if (this.hasImages) {
                            var loader = new Three.TextureLoader();
                            loader.load(
                                i < 9 ? require('../assets/leaves/png/iPAD2_C0' + (i + 1) + '_EX01_B.png') : require('../assets/leaves/png/iPAD2_C' + (i + 1) + '_EX01_B.png'),//../assets/leaves/iPAD2_C0\' + i + \'_EX04_B.TIFF'
                                function (texture) {
                                    texture.repeat.set(1, 1);
                                    material = new Three.MeshStandardMaterial({
                                        flatshading: true,
                                        map: texture
                                    });
                                    setTimeout(() => {
                                        return material;
                                    }, 300)

                                },
                            );
                        } else {
                            material = new Three.MeshStandardMaterial({color: this.modelColor, flatShading: true});
                        }
                        setTimeout(() => {

                            var sphere = new Three.Mesh(geometry, material);


                            sphere.position.set(this.tsneInputData[i][0] * 1500, this.tsneInputData[i][1] *1500, this.tsneInputData[i][2] *1500);
                            this.pointsContainer.add(sphere);
                        }, 400);

                    }
                    this.pointsContainer.position.z -= 2;
                    this.scene.add(this.pointsContainer);
                    setTimeout(() => {
                        if (this.labels != null) {
                            this.createTextLabels()
                        }
                    }, 200)
                }, 300)

            },
          updateDimensions() {
            this.camera.aspect = this.$refs.tsnethree.clientWidth / this.$refs.tsnethree.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.$refs.tsnethree.clientWidth, this.$refs.tsnethree.clientHeight);
          }
        },
        created: function() {
        window.addEventListener("resize", this.updateDimensions);

      },
        destroyed: function() {
        window.removeEventListener("resize", this.updateDimensions);
      },
        mounted() {
          this.windowparams.width = this.$refs.tsnethree.clientWidth;
          this.windowparams.height = this.$refs.tsnethree.clientHeight;
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

<style>
    #tsne-three {
        width: 100%;
        height: 100vh;
    }
    #tsnethree-text {
        position: absolute;
        width: 100%;
        pointer-events: none;
        font-size: 10px;
        text-align: center;
    }
    #tsnethree-text p {
        position: absolute;
        right: 0;
        top: -50vh;
        left: -150vw;
    }
</style>