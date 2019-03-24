/*
* Tsne-three Komponente.
*/
<template>
  <!-- container des plugins der Canvas wird hinter dem Text eingefügt -->
  <div ref="tsnethree" id="tsne-three">
    <!-- rendert die Textelemente -->
    <div ref="textlabels" id="tsnethree-text"/>
  </div>
</template>

<script>
import * as Three from "three";
export default {
  name: "Tsne-three",
  data() {
    return {
      camera: null,
      scene: null,
      once: false,
      renderer: null,
      mesh: null,
      pointsMaterial: null,
      pointsContainer: new Three.Object3D(),
      tsneOutput: null,
      error: "",
      iteration: ""
    };
  },
  props: {
    // übergebene Properties müssen in der Komponente noch einmal definiert werden (hier mit definierten default Werten und Typen)
    inputJSON: {},
    modelColor: { default: "#a2a2a2", type: String },
    dim: { default: 3, type: Number },
    perplexity: { default: 30, type: Number },
    earlyExaggeration: { default: 1.0, type: Number },
    learningRate: { default: 100.9, type: Number },
    nIter: { default: 3500, type: Number },
    metric: { default: "euclidean", type: String },
    imagePath: { default: "", type: String },
    labels: { default: null, type: Array }
  },
  methods: {
    // Methoden der Komponente
    init: function() {
      //
      this.$refs.textlabels.style.width =
        this.$refs.tsnethree.clientWidth + "px";
      this.$refs.textlabels.style.height =
        this.$refs.tsnethree.clientHeight + "px";
      this.camera = new Three.PerspectiveCamera(
        100,
        this.$refs.tsnethree.clientWidth / this.$refs.tsnethree.clientHeight,
        0.00002,
        12000
      );
      this.camera.position.z = 200;
      this.camera.rotation.x = 1.5;
      this.scene = new Three.Scene();
      var light = new Three.AmbientLight("#fff", 1.7);
      this.scene.add(light);

      const color = "#c5c7cf";
      const near = 1;
      const far = 60;
      this.scene.fog = new Three.Fog(color, near, far); // fog um die Szene dreidimensionaler erscheinen zu lassen

      var light = new Three.PointLight("#f2242d", 1, 100);
      light.position.set(0, 6, 3);
      light.castShadow = true;

      this.scene.add(light);
      this.renderer = new Three.WebGLRenderer(
        { antialias: true, alpha: true },
        { alpha: true }
      );
      this.renderer.setSize(
        this.$refs.tsnethree.clientWidth,
        this.$refs.tsnethree.clientHeight
      );
      // OrbitControls ermöglichen die Bewegeung in der Szene.
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.enableDamping = false;
      controls.enableZoom = true;
      controls.dampingFactor = 0.85;
      controls.maxDistance = 100;
      this.$refs.tsnethree.appendChild(this.renderer.domElement);
    },
    /*
     * wird bei jedem rendern des frames aufgerufen
     * enthält den Funktionsaufruf für das neuzuordnen der Textelemente (remapTextlabels)
     */
    animate: function() {
      setTimeout(() => {
        if (this.labels != null) {
          this.remapTextlabels();
        }
      }, 1000 / 30);
      requestAnimationFrame(this.animate);

      this.renderer.render(this.scene, this.camera);
    },
    /*GLOBALCOORDINATES
     * ermittelt die tatsächlichen globalen Koordinaten der Meshes
     */
    globalCoordinates(object, camera) {
      var vector = new Three.Vector3();
      var heightHalf = 0.5 * this.renderer.context.canvas.height;
      var widthHalf = 0.5 * this.renderer.context.canvas.width;

      object.updateMatrixWorld();
      vector.setFromMatrixPosition(object.matrixWorld);
      vector.project(camera);

      vector.x = vector.x * widthHalf + widthHalf;
      vector.y = -(vector.y * heightHalf) + heightHalf;
      return {
        x: vector.x,
        y: vector.y
      };
    },
    /*CREATETEXTLABELS
     * erschafft die Textelemente und projeziert sie auf die zugehörigen Datenpunkte im Model
     */
    createTextLabels() {
      for (let i = 0; i < this.labels.length; i++) {
        let label = document.createElement("p");
        label.innerHTML += this.labels[i] + "</br>";
        setTimeout(() => {
          let currentPos = this.globalCoordinates(
            this.pointsContainer.children[i],
            this.camera
          );
          label.style.marginTop =
            currentPos.y * 2 + this.$refs.tsnethree.clientHeight / 2 + "px";
          label.style.marginLeft =
            currentPos.x * 2 + this.$refs.tsnethree.clientWidth / 2 + "px";
          this.$refs.textlabels.appendChild(label);
        }, 200);
      }
    },
    /* REMAPTEXTLABELS
     * updated den HTML Text nachdem das Modell in der Szene verändert wurde, oder ein resize statt gefunden hat
     */
    remapTextlabels() {
      let children = this.$refs.textlabels.childNodes;
      for (let i = 0; i < this.pointsContainer.children.length; i++) {
        let vector = new Three.Vector3();
        vector.setFromMatrixPosition(
          this.pointsContainer.children[i].matrixWorld
        );
        this.pointsContainer.children[i].geometry.verticesNeedUpdate = true;
        let calcs = this.globalCoordinates(
          this.pointsContainer.children[i],
          this.camera
        );
        children[i].style.marginTop =
          this.globalCoordinates(this.pointsContainer.children[i], this.camera)
            .y +
          this.$refs.tsnethree.clientHeight / 2 +
          "px";
        children[i].style.marginLeft =
          calcs.x * 2 + this.$refs.tsnethree.clientWidth / 2 + "px";
        this.pointsContainer.updateMatrixWorld();
        this.scene.updateMatrixWorld();
      }
    },
    /* CREATETHREEMODEL
     * generiert das three.js Model
     */
    createThreeModel() {
      var geometry = new Three.BufferGeometry();
      var vertices = new Float32Array([
        -1,
        -1,
        1,
        1,
        -1,
        1,
        1,
        1,
        1,

        1,
        1,
        1,
        -1,
        1,
        1,
        -1,
        -1,
        1
      ]);
      var uvs = new Float32Array([
        0,
        0,
        0.9,
        0.9,
        0,
        0.9,
        0.9,
        0.9,
        0.9,

        0.9,
        0.9,
        0.9,
        0,
        0.9,
        0.9,
        0,
        0,
        0.9
      ]);
      geometry.addAttribute("position", new Three.BufferAttribute(vertices, 3));
      geometry.addAttribute("uv", new Three.BufferAttribute(uvs, 3));
      geometry.computeVertexNormals();

      for (let i = 0; i < this.tsneOutput.length; i++) {
        let material;
        if (this.imagePath != "" || !this.imagePath === undefined) {
          var loader = new Three.TextureLoader();
          loader.load(
            i < 9
              ? require("../assets/" + this.imagePath + "0" + (i + 1) + ".png")
              : require("../assets/" + this.imagePath + (i + 1) + ".png"),
            function(texture) {
              texture.repeat.set(1, 1);
              material = new Three.MeshBasicMaterial({
                map: texture
              });
              setTimeout(() => {
                return material;
              }, 300);
            }
          );
        } else {
          material = new Three.MeshStandardMaterial({
            color: this.modelColor
          });
        }
        setTimeout(() => {
          var sphere = new Three.Mesh(geometry, material);
          let zIndex;
          this.dim === 2 ? (zIndex = 0) : (zIndex = this.tsneOutput[i][2]);
          if (this.earlyExaggeration > 1.0) {
            sphere.position.set(
              this.tsneOutput[i][0],
              this.tsneOutput[i][1],
              zIndex
            );
          } else {
            sphere.position.set(
              this.tsneOutput[i][0] * 1500,
              this.tsneOutput[i][1] * 1500,
              zIndex
            );
          }
          console.log(sphere.position.z);
          this.pointsContainer.add(sphere);
        }, 400);
      }
      this.pointsContainer.position.z -= 2;
      this.scene.add(this.pointsContainer);
      setTimeout(() => {
        if (this.labels != null) {
          this.createTextLabels();
        }
      }, 200);
    },
    /* CREATETSNE
     * diese Funktion enthält die Implementierung des t-sne.js Plugins.
     * das Property inputJson wird hier verwendet um Koordinaten zu erzeugen die dann in tsneOutput gespeichert
     */
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
        type: "dense"
      });
      model.run();
      model.rerun();
      this.tsneOutput = model.getOutput();
      setTimeout(() => {
        this.createThreeModel();
      }, 300);
    },
    /* UPDATEDIMENSIONS
     *  updated die Dimensionen des Canvas Elementes im Browser nach einem resize Event
     */
    updateDimensions() {
      this.$refs.textlabels.style.width =
        this.$refs.tsnethree.clientWidth + "px";
      this.$refs.textlabels.style.height =
        this.$refs.tsnethree.clientHeight + "px";
      this.camera.aspect =
        this.$refs.tsnethree.clientWidth / this.$refs.tsnethree.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        this.$refs.tsnethree.clientWidth,
        this.$refs.tsnethree.clientHeight
      );
    }
  },
  /*
   *  erste Methode die aufgerufen wird noch bevor die Komponente im DOM angelegt ist
   */
  created: function() {
    window.addEventListener("resize", this.updateDimensions);
  },
  /*
   *  muss aufgerufen werden bevor die Komponente zerstört wird
   */
  destroyed: function() {
    window.removeEventListener("resize", this.updateDimensions);
  },
  /*
   *  wird aufgerufen nachdem die Komponente im DOM angelegt ist. Enthält Funktionsaufrufe für das Erstellen der Szene (init)
   *  Animation (animate) und die Berechnung von t-SNE (createTsne)
   */
  mounted() {
    this.init();
    this.once === false ? this.createTsne() : (this.once = true);
    setTimeout(() => {
      this.animate();
    }, 1000 / 30);
  },
  install(Vue, options) {}
};
</script>
// styling Eigenschaften auf die die Nutzerinnen von außen keinen Zugriff haben sollen
<style>
#tsnethree-text {
  position: absolute;
  width: 100%;
  pointer-events: none;
  font-size: 10px;
  text-align: center;
  overflow: hidden;
}
#tsnethree-text p {
  position: absolute;
  right: 0;
  top: -50%;
  left: -150%;
}
</style>