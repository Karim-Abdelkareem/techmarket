import { validate } from "../middleware/validate.js";
import {
  mobileTabletSchema,
  laptopSchema,
  audioSchema,
  cableSchema,
  caseCoverSchema,
  chargerSchema,
  powerBankSchema,
  screenProtectorSchema,
  wearableSchema,
} from "../modules/models/validationSchemas.js";

export const PRODUCT_TYPE_SCHEMAS = {
  MobileTablet: mobileTabletSchema,
  Laptop: laptopSchema,
  Audio: audioSchema,
  Cable: cableSchema,
  CaseCover: caseCoverSchema,
  Charger: chargerSchema,
  PowerBank: powerBankSchema,
  ScreenProtector: screenProtectorSchema,
  Wearable: wearableSchema,
};
