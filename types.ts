export type OrnamentType = 'sphere' | 'diamond' | 'box';

export interface OrnamentData {
  id: number;
  position: [number, number, number];
  type: OrnamentType;
  scale: number;
  color: string;
}

export interface TreeLayerProps {
  position: [number, number, number];
  scale: number;
  radius: number;
  height: number;
}

export interface SceneState {
  isRotating: boolean;
  lightIntensity: number;
  toggleRotation: () => void;
  setLightIntensity: (val: number) => void;
}