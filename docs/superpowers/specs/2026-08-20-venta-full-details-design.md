# Sale listing full detail sheet

## Goal
Sale apartments expose the full Metrocuadrado-style detail set (building name, apt, tower, yes/no features, finishes) in admin and on the public listing sheet with a polished layout.

## Data
- `buildingName` column + `sale_details` JSONB on `listings`
- Typed `SaleDetails` in `app/lib/sale-details.ts`
- Shown only when `operation === "venta"`

## UI
- Admin: section “Detalles de venta” with text fields + checkboxes
- Public modal: title = building name; meta row; highlight stats; 4-column detail grid; observaciones
