export type Source = {
  name: string;
  type: "cubeTexture" | "model" | "texture" | "font";
  path: string[] | string;
};

export const sources: Source[] = [
  {
    name: "font",
    path: "/font/helvetiker_regular.typeface.json",
    type: "font",
  },
];
