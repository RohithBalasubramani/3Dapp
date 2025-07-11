import { useBox } from "@react-three/cannon";
import { nanoid } from "nanoid";
import React, { useCallback, useState } from "react";
import { create } from "zustand";

export const useCubeStore = create((set) => ({
  cubes: [],
  addCube: (x, y, z) =>
    set((state) => ({
      cubes: [...state.cubes, [x, y, z]],
    })),
}));

export const Cubes = () => {
  const cubes = useCubeStore((state) => state.cubes)
  return cubes.map((coords, index) => <Cube key={index} position={coords} />)
}

const Cube = (props) => {
  const addCube = useCubeStore((state) => state.addCube);
  const [hover, setHover] = useState(null);

  const [ref] = useBox(() => ({
    type: "Static",
    ...props,
  }));

  const onHover = useCallback((e) => {
    e.stopPropagation();
    setHover(Math.floor(e.faceIndex / 2));
  }, []);

  const onOut = useCallback(() => setHover(null), []);

  const onClick = useCallback((e) => {
    e.stopPropagation();
    const { x, y, z } = ref.current.position;
    const dir = [
      [x + 1, y, z],
      [x - 1, y, z],
      [x, y + 1, z],
      [x, y - 1, z],
      [x, y, z + 1],
      [x, y, z - 1],
    ];
    addCube(...dir[Math.floor(e.faceIndex / 2)]);
  }, []);

  return (
    <mesh
      castShadow
      receiveShadow
      ref={ref}
      onPointerMove={onHover}
      onPointerOut={onOut}
      onClick={onClick}
    >
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial
          attach={`material-${index}`}
          key={index}
          color={hover === index ? "hotpink" : "white"}
        />
      ))}
      <boxGeometry />
    </mesh>
  );
};

export default Cube;
