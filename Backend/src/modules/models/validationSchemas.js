import Joi from "joi";

export const baseProductSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string(),
  category: Joi.string()
    .valid("Mobile", "Tablet", "Laptop", "Accessories", "Wearables", "Audio")
    .required(),
  productType: Joi.string().required(),
  brand: Joi.string(),
  company: Joi.string().hex().length(24),
  price: Joi.number().required(),
  description: Joi.string(),
  quantity: Joi.number().required(),
  image: Joi.string(),
  images: Joi.array().items(Joi.string()),
  productCode: Joi.string().required(),
  referralCode: Joi.string(),
  discount: Joi.number().min(0).max(100),
  priceAfterDiscount: Joi.number(),
  isExclusive: Joi.boolean(),
});

export const mobileTabletSchema = baseProductSchema.concat(
  Joi.object({
    deviceType: Joi.string().valid("Mobile", "Tablet").required(),
    color: Joi.string().required(),
    simCard: Joi.string(),
    screen: Joi.string(),
    ram: Joi.string(),
    internalMemory: Joi.string(),
    rearCamera: Joi.string(),
    selfieCamera: Joi.string(),
    chipset: Joi.string(),
    cpu: Joi.string(),
    cpuSpeedGHz: Joi.number(),
    gpu: Joi.string(),
    operatingSystem: Joi.string(),
    productWarranty: Joi.string(),
    videoResolutions: Joi.string(),
    connectivity: Joi.string(),
    sensor: Joi.string(),
  })
);

export const laptopSchema = baseProductSchema.concat(
  Joi.object({
    laptopType: Joi.string()
      .valid("Student", "Professional", "Gaming", "X360", "Business", "MacBook")
      .required(),
    color: Joi.string(),
    processor: Joi.string(),
    ram: Joi.string(),
    hardDisk: Joi.string(),
    graphicsCard: Joi.string(),
    display: Joi.string(),
    connectivity: Joi.string(),
    speaker: Joi.string(),
    ioPorts: Joi.string(),
    operatingSystem: Joi.string(),
    warranty: Joi.string(),
  })
);

export const audioSchema = baseProductSchema.concat(
  Joi.object({
    audioType: Joi.string().valid("OverEar", "InEar", "Wireless").required(),
    color: Joi.string(),
    connectivity: Joi.string(),
    company: Joi.string(),
    features: Joi.array().items(Joi.string()),
    warranty: Joi.string(),
  })
);

export const cableSchema = baseProductSchema.concat(
  Joi.object({
    from: Joi.string(),
    to: Joi.string(),
    cableLength: Joi.string(),
    cableType: Joi.string(),
    features: Joi.array().items(Joi.string()),
  })
);

export const caseCoverSchema = baseProductSchema.concat(
  Joi.object({
    compatibleWith: Joi.string(),
    color: Joi.string(),
    material: Joi.string(),
  })
);

export const chargerSchema = baseProductSchema.concat(
  Joi.object({
    input: Joi.string(),
    power: Joi.string(),
    color: Joi.string(),
    chargerType: Joi.string(),
    features: Joi.array().items(Joi.string()),
  })
);

export const powerBankSchema = baseProductSchema.concat(
  Joi.object({
    capacity: Joi.string(),
    input: Joi.string(),
    output: Joi.string(),
    color: Joi.string(),
    powerBankType: Joi.string(),
    features: Joi.array().items(Joi.string()),
  })
);

export const screenProtectorSchema = baseProductSchema.concat(
  Joi.object({
    compatibleWith: Joi.string(),
    color: Joi.string(),
    material: Joi.string(),
  })
);

export const wearableSchema = baseProductSchema.concat(
  Joi.object({
    wearableType: Joi.string().valid("SmartBand", "SmartWatch").required(),
    display: Joi.string(),
    color: Joi.string(),
    connectivity: Joi.string(),
    features: Joi.array().items(Joi.string()),
    battery: Joi.string(),
    warranty: Joi.string(),
  })
);
