"use client";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Vector3, Mesh, Box3Helper } from "three";
import { create } from "zustand";

export const useSTLStore = create((set) => ({
  models: [],
  addModel: (x, y, z, geo) => set((s) => ({ models: [...s.models, { pos: [x, y, z], geo }] })),
  selectedModel: null,
  setSelectedModel: (model) => set({ selectedModel: model }),
  dragging: null, // { geo, scale } | null
  startDrag: (geo, scale) => set({ dragging: { geo, scale } }),
  finishDrag: () => set({ dragging: null }),
}));

export const Models = () => {
  const models = useSTLStore((s) => s.models);
  return models.map(({ pos, geo }, i) => (
    <STLModel key={i} position={pos} geom={geo}/>
  ));
};

export default function STLModel(props) {
  const meshRef = useRef();
  const [bboxHelper, setBboxHelper] = useState(null);
  const [cuboid, setCuboid] = useState(null);
  const [cuboidCenter, setCuboidCenter] = useState(null);
  const [cuboidZ, setCuboidZ] = useState(0);
  const [hover, setHover] = useState(null);
  // const stlModel = useLoader(STLLoader, "/models/demo.stl");
  // const geom = useMemo(() => {
  //   const g = stlModel.clone();
  //   g.computeVertexNormals();
  //   g.computeBoundingBox();
  //   g.center();
  //   return g;
  // }, [stlModel]);
  const addModel = useSTLStore((state) => state.addModel);

  useEffect(() => {
    if (meshRef.current) {
      const boundingBox = new Box3().setFromObject(meshRef.current);
      const size = new Vector3();
      boundingBox.getSize(size);
      const center = new Vector3();
      boundingBox.getCenter(center);
      setCuboidZ(size.z);

      
      if (!bboxHelper) {
        const helper = new Box3Helper(boundingBox, 0xffff00); 
        setBboxHelper(helper);
      }

      
      const cuboidGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      setCuboid(cuboidGeometry); 
      setCuboidCenter(center); 
    }
  }, [props.geom]);

  const onHover = useCallback((e) => {
    e.stopPropagation();
    setHover(Math.floor(e.faceIndex / 2));
  }, []);

  const onOut = useCallback(() => setHover(null), []);

  const onClick = useCallback((e) => {
    e.stopPropagation();
    const { x, y, z } = meshRef.current.position;
    const size = meshRef.current.geometry.boundingBox.getSize(new Vector3());
    const halfWidth = size.x;
    const halfHeight = size.y;
    const halfDepth = size.z;

    const offsetFactor = 0.001;

    const dir = [
      [x + halfWidth * offsetFactor, y, z], // Right 
      [x - halfWidth * offsetFactor, y, z], // Left 
      [x, y + halfHeight * offsetFactor, z], // Up 
      [x, y - halfHeight * offsetFactor, z], // Down 
      [x, y, z + halfDepth * offsetFactor], // Front 
      [x, y, z - halfDepth * offsetFactor], // Back 
    ];
    if (
      Math.floor(e.faceIndex / 2) === 4 ||
      Math.floor(e.faceIndex / 2) === 5
    ) {
      addModel(...dir[Math.floor(e.faceIndex / 2)], props.geom);
    }
  }, []);

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={props.geom}
        scale={[0.001, 0.001, 0.001]}
        position={props.position}
      >
        <meshStandardMaterial color="hotpink" side={THREE.DoubleSide} />
      </mesh>
      {cuboid && cuboidCenter && (
        <mesh
          geometry={cuboid}
          position={cuboidCenter}
          onPointerMove={onHover}
          onPointerOut={onOut}
          onClick={onClick}
        >
          {[...Array(6)].map((_, index) => (
            <meshStandardMaterial
              attach={`material-${index}`}
              key={index}
              color={hover === index ? "green" : "white"}
              wireframe
            />
          ))}
        </mesh>
      )}
    </>
  );
}

// export function Cursor() {
//   const [hover, setHover] = useState(false);
//   const selectedModel = useSTLStore((state) => state.selectedModel);
//   const setSelectedModel = useSTLStore((state) => state.setSelectedModel);
//   const { camera, gl, scene } = useThree();
//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();
//   const [intersected, setIntersected] = useState(null);

//   // Update mouse position based on pointer
//   const onMouseDown = useCallback(
//     (event) => {
//       const rect = document.getElementById("workspace").getBoundingClientRect();
//       mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
//       raycaster.setFromCamera(mouse, camera);

//       // Find intersection points with the scene
//       const intersects = raycaster.intersectObject(scene, true);

//       if (intersects.length > 0) {
//         console.log(intersects);
//         const point = intersects[0].point;
//         console.log(point);
//         useSTLStore.getState().addModel(point.x, point.y, point.z);
//         // setIntersected(point);
//       }
//     },
//     [gl]
//   );

//   useEffect(() => {
//     window.addEventListener("mousedown", onMouseDown);
//     return () => {
//       window.removeEventListener("mousedown", onMouseDown);
//     };
//   }, [onMouseDown]);

//   return (
//     <>
//       {/* Display the selected STL model as the cursor */}
//       {selectedModel && intersected && (
//         <mesh position={intersected}>
//           <primitive object={selectedModel.geometry} />
//         </mesh>
//       )}

//       {/* Set cursor to pointer when hovering over an area to place */}
//       <mesh
//         position={intersected || [0, 0, 0]}
//         onPointerEnter={() => setHover(true)}
//         onPointerLeave={() => setHover(false)}
//       >
//         <circleGeometry args={[0.05, 32]} />
//         <meshStandardMaterial color={hover ? "green" : "gray"} />
//       </mesh>
//     </>
//   );
// }

export function Cursor() {
  const { camera, scene, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useRef(new THREE.Vector2());

  const dragging = useSTLStore((s) => s.dragging);
  const addModel = useSTLStore((s) => s.addModel);
  const finishDrag = useSTLStore((s) => s.finishDrag);

  const [hit, setHit] = useState(null);          

  
  const onPointerMove = useCallback((e) => {
    const { left, top, width, height } =
      gl.domElement.getBoundingClientRect();

    mouse.current.x = ((e.clientX - left) / width) * 2 - 1;
    mouse.current.y = -((e.clientY - top) / height) * 2 + 1;

    raycaster.setFromCamera(mouse.current, camera);

    
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); 
    const p = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, p);

    setHit(p.clone());
  }, [camera, gl]);

  const onClick = useCallback(() => {
    if (!dragging || !hit) return;
    addModel(hit.x, hit.y, hit.z, dragging.geo);
    finishDrag();                               
  }, [dragging, hit]);

  
  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onClick);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onClick);
    };
  }, [onPointerMove, onClick]);

  
  return dragging && hit ? (
    <mesh position={hit} scale={dragging.scale} pointerEvents={false}>
      <primitive object={dragging.geo} />
      <meshStandardMaterial transparent opacity={0.6} color="cyan" />
    </mesh>
  ) : null;
}

