export type Source = {
  name: string;
  type: "cubeTexture" | "model" | "texture";
  path: string[] | string;
};

export const sources: Source[] = [
  {
    name: "model",
    path: "/models/kira.glb",
    type: "model",
  },
];
