export interface SensiSettings {
  id: string;
  deviceName: string;
  deviceBrand: string;
  processor: string;
  ramVariants: RamVariant[];
  isPremium: boolean;
  price?: number;
  rating: number;
  downloads: number;
  updateVersion: string;
}

export interface RamVariant {
  ram: string;
  general: number;
  redDot: number;
  twoX: number;
  fourX: number;
  awm: number;
  freeLook: number;
}
