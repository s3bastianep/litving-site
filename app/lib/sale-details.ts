/** Extra fields for sale (venta) apartments — shown in admin + public detail sheet. */
export type SaleDetails = {
  apartmentNumber?: string;
  tower?: string;
  parkingNumber?: string;
  ageYears?: number;
  renovated?: boolean;
  elevatorCount?: number;
  balcony?: boolean;
  terrace?: boolean;
  livingRoom?: boolean;
  study?: boolean;
  storage?: boolean;
  serviceRoom?: boolean;
  integralKitchen?: boolean;
  penthouse?: boolean;
  exteriorView?: boolean;
  coveredGarage?: boolean;
  acOrHeating?: boolean;
  grayWorkBathroom?: boolean;
  grayWorkProperty?: boolean;
  socialAreaFlooring?: string;
  bedroomFlooring?: string;
  garageType?: string;
  observations?: string;
};

export function emptySaleDetails(): SaleDetails {
  return {};
}

export function normalizeSaleDetails(input?: Partial<SaleDetails> | null): SaleDetails | undefined {
  if (!input || typeof input !== "object") return undefined;
  const ageYears =
    input.ageYears === undefined || input.ageYears === null || Number.isNaN(Number(input.ageYears))
      ? undefined
      : Math.max(0, Math.round(Number(input.ageYears)));
  const elevatorCount =
    input.elevatorCount === undefined || input.elevatorCount === null || Number.isNaN(Number(input.elevatorCount))
      ? undefined
      : Math.max(0, Math.round(Number(input.elevatorCount)));

  const next: SaleDetails = {
    apartmentNumber: String(input.apartmentNumber || "").trim() || undefined,
    tower: String(input.tower || "").trim() || undefined,
    parkingNumber: String(input.parkingNumber || "").trim() || undefined,
    ageYears,
    renovated: input.renovated === undefined ? undefined : Boolean(input.renovated),
    elevatorCount,
    balcony: input.balcony === undefined ? undefined : Boolean(input.balcony),
    terrace: input.terrace === undefined ? undefined : Boolean(input.terrace),
    livingRoom: input.livingRoom === undefined ? undefined : Boolean(input.livingRoom),
    study: input.study === undefined ? undefined : Boolean(input.study),
    storage: input.storage === undefined ? undefined : Boolean(input.storage),
    serviceRoom: input.serviceRoom === undefined ? undefined : Boolean(input.serviceRoom),
    integralKitchen: input.integralKitchen === undefined ? undefined : Boolean(input.integralKitchen),
    penthouse: input.penthouse === undefined ? undefined : Boolean(input.penthouse),
    exteriorView: input.exteriorView === undefined ? undefined : Boolean(input.exteriorView),
    coveredGarage: input.coveredGarage === undefined ? undefined : Boolean(input.coveredGarage),
    acOrHeating: input.acOrHeating === undefined ? undefined : Boolean(input.acOrHeating),
    grayWorkBathroom: input.grayWorkBathroom === undefined ? undefined : Boolean(input.grayWorkBathroom),
    grayWorkProperty: input.grayWorkProperty === undefined ? undefined : Boolean(input.grayWorkProperty),
    socialAreaFlooring: String(input.socialAreaFlooring || "").trim() || undefined,
    bedroomFlooring: String(input.bedroomFlooring || "").trim() || undefined,
    garageType: String(input.garageType || "").trim() || undefined,
    observations: String(input.observations || "").trim() || undefined,
  };

  return Object.values(next).some(v => v !== undefined) ? next : undefined;
}

export function yesNo(value: boolean | undefined) {
  if (value === undefined) return undefined;
  return value ? "Sí" : "No";
}
