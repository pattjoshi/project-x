"use client";

import { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, type VRM } from "@pixiv/three-vrm";

import { vrmPresetForEmotion } from "./emotion";

export function VrmAvatar({ url, emotion }: { url: string; emotion: string }) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });
  const vrm = gltf.userData.vrm as VRM;
  const currentExpression = useRef<string>("neutral");

  useEffect(() => {
    vrm.scene.position.set(0, 0, -0.8);
    vrm.scene.rotation.y = Math.PI;
  }, [vrm]);

  useEffect(() => {
    const manager = vrm.expressionManager;
    if (!manager) return;
    if (currentExpression.current) manager.setValue(currentExpression.current, 0);
    const preset = vrmPresetForEmotion(emotion);
    manager.setValue(preset, 1);
    currentExpression.current = preset;
  }, [vrm, emotion]);

  useFrame((_, delta) => {
    vrm.update(delta);
  });

  return <primitive object={vrm.scene} />;
}
