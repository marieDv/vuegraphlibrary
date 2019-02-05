


<template>
  <renderer :size="{ w: 600, h: 400 }">
    <scene>
      <camera :position="{ z: 15 }"></camera>
      <mesh name="Cube">
        <geometry type="Sphere" :args="[2, 10, 10]"></geometry>
        <material type="MeshBasic">
        </material>
      </mesh>
    </scene>
  </renderer>
</template>

<script>
export default {
  name: 'workin',
  data () {
    return {
      msg: 'blablabla'
    }
  },
  created(){
      fetch('//fastforwardlabs.github.io/visualization_assets/word2vec_tsne_2d.json')
          .then(response => response.json())
          .then(raw_points => {

              const pointsGeometry = new THREE.Geometry();
              const colors = [];
              for (const point of raw_points) {
                  const vertex = new THREE.Vector3(point.coords[0], point.coords[1], 0);
                  pointsGeometry.vertices.push(vertex);
                  const color = new THREE.Color();
                  color.setHSL(Math.random(), 1.0, 0.5);
                  colors.push(color);
              }
              pointsGeometry.colors = colors;
              pointsMaterial = new THREE.PointsMaterial({
                  size: 6,
                  sizeAttenuation: false,
                  vertexColors: THREE.VertexColors,
              });
              const points = new THREE.Points(pointsGeometry, pointsMaterial);
              const pointsContainer = new THREE.Object3D();
              pointsContainer.add(points);
              console.log("created")
              scene.add(pointsContainer);
          });
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
