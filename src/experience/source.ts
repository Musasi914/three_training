export type Source = {
  name: string;
  type: "cubeTexture" | "model" | "texture";
  path: string[] | string;
};

export const sources: Source[] = [
  {
    name: "tokyoModel",
    path: "/models/LittlestTokyo.glb",
    type: "model",
  },
];
