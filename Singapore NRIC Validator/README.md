# Singapore NRIC Validator

A Power Apps Component Framework (PCF) control that validates Singapore National Registration Identity Card (NRIC) and Foreign Identification Number (FIN) numbers.

## Overview

The Singapore NRIC / FIN is a 9-character identifier in the format `[prefix][7 digits][check letter]`.

| Prefix | Description |
|--------|-------------|
| `S`    | Singapore citizen born before 2000 |
| `T`    | Singapore citizen born from 2000 onwards |
| `F`    | Foreigner / PR registered before 2000 |
| `G`    | Foreigner / PR registered from 2000 onwards |
| `M`    | Foreigner registered from 2022 onwards |

The check letter is computed using a weighted checksum algorithm against the 7 digits.

## Properties

| Property    | Type              | Usage  | Description |
|-------------|-------------------|--------|-------------|
| `nricNumber` | SingleLine.Text  | bound  | The NRIC / FIN number to validate (e.g. `S1234567D`) |
| `isValid`    | TwoOptions       | output | `true` when the entered NRIC / FIN number passes checksum validation |

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the control:
   ```bash
   npm run build
   ```

3. Start the test harness:
   ```bash
   npm start
   ```

## Validation Algorithm

1. Extract the 7 digits between the prefix and check letter.
2. Multiply each digit by the weights `[2, 7, 6, 5, 4, 3, 2]` and sum the products.
3. Add an offset based on the prefix: `T` or `G` → **+4**; `M` → **+3**; `S` or `F` → **+0**.
4. Compute `remainder = sum % 11`.
5. Look up the expected check letter:
   - Prefixes `S` / `T`: `"JZIHGFEDCBA"[remainder]`
   - Prefixes `F` / `G` / `M`: `"XWUTRQPNMLK"[remainder]`
6. The NRIC is valid if the actual check letter matches the expected check letter.
