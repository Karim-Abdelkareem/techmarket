import MobileTabletModel from "../modules/models/MobileTabletModel.js";
import { Cable } from "../modules/models/CableModel.js";
import { Charger } from "../modules/models/ChargerModel.js";
import { PowerBank } from "../modules/models/PowerBankModel.js";
import { CaseCover } from "../modules/models/CaseCoverModel.js";
import { ScreenProtector } from "../modules/models/ScreenProtectorModel.js";
import { Audio } from "../modules/models/AudioModel.js";
import { Wearable } from "../modules/models/WearableSchema.js";
import { Laptop } from "../modules/models/LaptopModel.js";
import { Gaming } from "../modules/models/GamingModel.js";

export const PRODUCT_MODELS = {
  MobileTablet: MobileTabletModel,
  Cable,
  Charger,
  PowerBank,
  CaseCover,
  ScreenProtector,
  Audio,
  Wearable,
  Laptop,
  Gaming,
  Games: Gaming,
  Accounts: Gaming,
  PlayStation: Gaming,
  Controller: Gaming,
  Skin: Gaming,
};
