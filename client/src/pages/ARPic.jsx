// import React, { Suspense } from 'react';
// import { Canvas } from 'react-three-fiber';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


// const GLBViewer = () => {
//   return (
//     <Canvas>
//       <ambientLight />
//       <pointLight position={[10, 10, 10]} />
//       <Suspense fallback={null}>
//         <Model />
//       </Suspense>
//     </Canvas>
//   );
// };

// const Model = () => {
//   const gltf = useLoader(GLTFLoader, './../../image/poly.glb');

//   return <primitive object={gltf.scene} />;
// };

// export default GLBViewer;
