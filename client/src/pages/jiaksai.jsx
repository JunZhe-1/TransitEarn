import React, { Suspense, useRef } from 'react';
import { Canvas, useLoader, useFrame ,useThree} from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const GLBViewer = ({ productId }) => {
  console.log(productId);

  const gltfPath = `${import.meta.env.VITE_FILE_BASE_URL}${productId}`;
  console.log(gltfPath);
  const center = [0, 0, 0]; // Coordinates for the center of the scene

  return (
    <div style={{ width: '300px', height: '300px' }}>
      <Canvas>
        <ambientLight />
        <pointLight position={center} />
        <Suspense fallback={null}>
          {/* Adjust the scale value to make the 3D object bigger or smaller */}
          <Model gltfPath={gltfPath} scale={50} />
        </Suspense>
        <CameraControls/>
      </Canvas>
    </div>
  );
};

const Model = ({ gltfPath, scale }) => {
  const gltf = useLoader(GLTFLoader, gltfPath);
  const modelRef = useRef();

  // Basic rotation speed
  const rotationSpeed = 0.02;

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += rotationSpeed;
    }
  });

  return <primitive ref={modelRef} object={gltf.scene} scale={scale} />;
};

const CameraControls = () => {
  const { camera } = useThree();

  // Zoom sensitivity
  const zoomSpeed = 0.1;

  // Use the useFrame hook to update the camera position on each frame
  useFrame(() => {
    const distance = 50; // Adjust this value to change the camera distance from the object
    const newDistance = distance + (zoomSpeed * -camera.position.z);
    camera.position.set(0, 0, newDistance);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

export default GLBViewer;
