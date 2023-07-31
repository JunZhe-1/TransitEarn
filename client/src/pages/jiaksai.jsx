import React, { Suspense, useRef } from 'react';
import { Canvas, useLoader, useFrame, useThree } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function GLBViewer({ productId }) {
  console.log(productId)

  const gltfPath = `${import.meta.env.VITE_FILE_BASE_URL}${productId}`;
  console.log(gltfPath);
  const center = [0, 0, 0]; // Coordinates for the center of the scene


  return (
    <Canvas style={{ width: '500px', height: '500px' }}>
      <ambientLight />
      <pointLight position={center} />
      <Suspense fallback={null}>
        <Model gltfPath={gltfPath} />
      </Suspense>
      <CameraControls />
    </Canvas>
  );
}

const Model = ({ gltfPath }) => {
  const gltf = useLoader(GLTFLoader, gltfPath);
  const modelRef = useRef();

  // Basic rotation speed
  const rotationSpeed = 0.005;

  // Use the useFrame hook to update the model rotation on each frame
  useFrame(() => {
    if (modelRef.current) {
      // Rotate the model around the Y-axis
      modelRef.current.rotation.y += rotationSpeed;
    }
  });

  return <primitive ref={modelRef} object={gltf.scene} />;
};

const CameraControls = () => {
  const { camera } = useThree();
  const cameraRef = useRef();

  // Zoom sensitivity
  const zoomSpeed = 0.1;

  // Use the useFrame hook to update the camera position on each frame
  useFrame(() => {
    if (cameraRef.current) {
      const distance = camera.position.length();
      const newDistance = distance + (zoomSpeed * -camera.position.z);
      camera.position.set(0, 0, newDistance);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

export default GLBViewer;
