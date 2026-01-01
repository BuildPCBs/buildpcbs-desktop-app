export type EnclosureMaterial = "ABS" | "PLA" | "PETG" | "ALUMINUM";
export type ManufacturingProcess = "3D_PRINT" | "CNC";
export type ComponentType = "BUTTON" | "USB_C" | "T_SLOT" | "SSD_MOUNT";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface EnclosureSpec {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  wallThickness: number;
  material: EnclosureMaterial;
}

export interface ComponentSpec {
  id: string;
  type: ComponentType;
  position: Vector3;
  rotation: Vector3;
}

export interface ManufacturingSpec {
  process: ManufacturingProcess;
  tolerance: number; // in mm
}

export interface MechanicalProject {
  enclosure: EnclosureSpec;
  components: ComponentSpec[];
  manufacturing: ManufacturingSpec;
}

export interface ViewSettings {
  exploded: boolean;
  clipping: boolean;
}
