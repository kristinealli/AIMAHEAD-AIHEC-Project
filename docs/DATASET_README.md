# Dataset README

This document describes the two processed BRFSS files used by this project. 

## Files and coverage

| File | Years | Respondents | Variables |
|---|---:|---:|---:|
| `analysis_pooled_2014_2024.rds` | 2014–2024 | 4,790,742 | 25 |
| `full_slim_2025.rds` | 2025 | 356,158 | 22 |
| **Combined** | **2014–2025** | **5,146,900** | — |

The historical file contains 11 annual BRFSS samples. The separate 2025 file
is held out for the final evaluation stage.

## Respondents by year

The counts below are the number of records in each source file before excluding
records for missing FMD outcomes, missing race indicators, or any modeling
restriction.

| Year | Respondents | AI/AN-alone respondents | Valid FMD | Missing/unknown FMD | Reporting states |
|---:|---:|---:|---:|---:|---:|
| 2014 | 456,158 | 8,315 | 448,268 | 7,890 | 51 |
| 2015 | 434,382 | 7,940 | 427,023 | 7,359 | 51 |
| 2016 | 477,665 | 8,601 | 469,861 | 7,804 | 51 |
| 2017 | 444,023 | 9,820 | 436,886 | 7,137 | 51 |
| 2018 | 430,949 | 9,130 | 424,080 | 6,869 | 51 |
| 2019 | 409,810 | 7,991 | 401,146 | 8,664 | 50 |
| 2020 | 394,831 | 8,081 | 386,992 | 7,839 | 51 |
| 2021 | 431,639 | 8,738 | 423,807 | 7,832 | 50 |
| 2022 | 435,826 | 9,018 | 426,923 | 8,903 | 51 |
| 2023 | 425,106 | 8,928 | 417,116 | 7,990 | 49 |
| 2024 | 450,353 | 9,140 | 442,292 | 8,061 | 50 |
| **Historical total** | **4,790,742** | **95,702** | **4,704,394** | **86,348** | — |
| 2025 | 356,158 | 6,973 | 349,674 | 6,484 | 50 |

`Valid FMD` means that `FMD` is coded as 0 or 1. Missing or unknown FMD
responses are retained in the audit but excluded from supervised model fitting
and performance metrics.

`AI/AN-alone respondents` counts records where `AIAN_ALONE` is `TRUE`. These
are source-record counts before FMD, weight, or modeling exclusions. Records
with missing or unresolved `AIAN_ALONE` values are not included in this column.

## Variables

The historical file includes the following variables. The 2025 file includes
the same analysis variables except `POOL_WEIGHT`, `YEAR_STRATUM`, and
`COMPLETE_MODEL`, which are historical processing fields.

| Variable | Description and use |
|---|---|
| `YEAR` | BRFSS survey year. |
| `STATE` | State or jurisdiction identifier used with the survey design. |
| `STRAT` | BRFSS sampling stratum identifier. |
| `PSU` | Primary sampling unit identifier. |
| `RAW_WEIGHT` | Unchanged CDC BRFSS `_LLCPWT` survey weight. Used for weighted estimates and evaluation. |
| `RACE_ALONE_RAW` | Original race-alone response coding retained for audit/reference. |
| `RACE_ETH_RAW` | Original race/ethnicity response coding retained for audit/reference. |
| `IMPRACE_RAW` | Original imputed race coding retained for audit/reference. |
| `AIAN_ALONE` | Harmonized logical indicator for AI/AN-alone status. Used to create evaluation groups, not as a model predictor. |
| `AIAN_NH_ALONE` | Harmonized logical indicator for AI/AN non-Hispanic-alone status. |
| `MENTHLTH_RAW` | Original BRFSS mental-health response coding. |
| `MENT14_CDC` | CDC-style 14-or-more mentally unhealthy days indicator. |
| `PHYSHLTH_RAW` | Original BRFSS physical-health response coding. |
| `MENTHLTH_DAYS` | Harmonized number of mentally unhealthy days in the past 30 days. |
| `PHYSHLTH_DAYS` | Harmonized number of physically unhealthy days in the past 30 days. |
| `FMD` | Analysis outcome: 1 when mentally unhealthy days are 14 or more, 0 otherwise. |
| `GENHLTH_CLEAN` | Harmonized general-health response category. |
| `AGE_BAND` | Harmonized age category used as a model predictor. |
| `SEX_CLEAN` | Harmonized sex category used as a model predictor. |
| `EDU_CLEAN` | Harmonized education category used as a model predictor. |
| `INCOME_BAND` | Harmonized income category used as a model predictor. |
| `PERIOD` | Source survey period/processing-period field. |
| `POOL_WEIGHT` | Historical pooled-data processing weight. Used when preparing the development sample. |
| `YEAR_STRATUM` | Historical year-stratum processing identifier. |
| `COMPLETE_MODEL` | Historical flag indicating whether the record meets the prepared complete-model schema. |

## Modeling variables

The six predictors used by the shared modeling workflow are:

- `PHYSHLTH_DAYS`, grouped into `physical_days_group`
- `GENHLTH_CLEAN`, grouped into `general_health_group`
- `AGE_BAND`
- `SEX_CLEAN`
- `EDU_CLEAN`
- `INCOME_BAND`

Missing predictor responses are represented as an explicit `Missing` category
when features are prepared. `AIAN_ALONE` is used only to define the primary
evaluation groups:

- AI/AN alone
- Other identified single-race
- Unresolved/multiracial

## Data processing notes

- The source files are RDS files containing processed data frames.
- The historical file is used for development (2014–2022), model selection
  (2023), and calibration (2024).
- The 2025 file is used as the separate final evaluation year.
- `FMD` is a classification outcome, not a clinical diagnosis.
- Survey weights, strata, and PSUs are retained so the project can calculate
  weighted descriptive and performance measures.
- The source files may contain additional missing or special-response codes
  before the shared preparation functions harmonize them.

For the complete model-training workflow, see
[`TRAINING_README.md`](./TRAINING_README.md).
