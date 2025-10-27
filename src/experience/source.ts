export type Source = {
  name: string;
  type: "cubeTexture" | "model" | "texture" | "font";
  path: string[] | string;
};

export const sources: Source[] = [
  {
    name: "decalDiffuse",
    type: "texture",
    path: "/textures/decal-diffuse.png",
  },
  {
    name: "decalNormal",
    type: "texture",
    path: "/textures/decal-normal.jpg",
  },
];
