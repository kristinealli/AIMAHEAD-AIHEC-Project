# Model Training README

This document outlines how the project trains and evaluates models for
frequent mental distress (FMD). The workflow is time-ordered so later survey
years are not used to train earlier models.

## Training timeline

| Survey years | Role                                                    |
| ------------ | ------------------------------------------------------- |
| 2014–2022    | Model development and forward-year validation           |
| 2023         | Candidate model comparison and national model selection |
| 2024         | Probability calibration                                 |
| 2025         | Final frozen-model evaluation                           |

The 2025 records are not used for model fitting, tuning, model selection, or
calibration.

## 1. Prepare the input data

The workflow reads:

- `analysis_pooled_2014_2024.rds` for development, selection, and calibration
- `full_slim_2025.rds` for the final evaluation year

The shared functions in [`R/helpers.Rmd`](../R/helpers.Rmd):

1. Check that the expected variables and survey years are present.
2. Keep only finite, positive survey weights for supervised modeling.
3. Convert missing predictor responses into an explicit `Missing` category.
4. Validate that physical-health days are whole numbers from 0 through 30.
5. Create the binary FMD outcome:
    - `FMD = 1`: 14 or more mentally unhealthy days
    - `FMD = 0`: fewer than 14 days
6. Create population labels for subgroup evaluation.

Missing FMD outcomes remain missing and are excluded from supervised training
and metric calculations. They are retained for response audits.

## 2. Model predictors

The model uses six predictor concepts:

- Physical-health days, grouped as `physical_days_group`
- General health, grouped as `general_health_group`
- `AGE_BAND`
- `SEX_CLEAN`
- `EDU_CLEAN`
- `INCOME_BAND`

Race is not a model predictor. `AIAN_ALONE` is used only to define evaluation
groups after predictions are produced.

## 3. Build the development sample

The development records from 2014–2022 are filtered to valid FMD outcomes and
then sampled to control computation time:

- AI/AN-alone records are retained.
- The larger other-single-race group is capped.
- Unresolved or multiracial records are capped separately.
- Sampling occurs within each group and survey year.
- The random seed is set in [`R/config.Rmd`](../R/config.Rmd).

Each retained record receives an inclusion probability. The training weight is:

```text
training weight = RAW_WEIGHT / inclusion probability
```

This preserves the original survey weight while compensating for computational
subsampling.

## 4. Fit candidate models

The project compares three model families:

1. Weighted logistic regression
2. Weighted LASSO logistic regression
3. Weighted probability random forest

Training weights are rescaled to have a mean of one before fitting. The fitted
models use the common categorical predictor schema, so factor levels remain
aligned across years and subsets.

## 5. Tune models with forward-year validation

The forward-validation notebook trains only on years before each assessment
year. For example, a 2022 assessment fold trains on records from 2014–2021.

The workflow evaluates:

- Logistic regression with its default setting
- Several LASSO penalty values
- Several random-forest `mtry` values

Settings are compared using mean weighted Brier score across the configured
validation years. Weighted AUROC is retained as a secondary measure.

See [`04_Forward_Year_Validation.Rmd`](../notebooks/04_Forward_Year_Validation.Rmd).

## 6. Select the national model

Each model family is refit on the complete sampled 2014–2022 development set
using its selected tuning setting. Candidate predictions are then evaluated on 2023.

The national winner is the model family with the lowest overall
survey-weighted 2023 Brier score. A prevalence-only model is retained as a
reference baseline.

Subgroup results are not used to select the national model.

See [`05_Select_Model_2023.Rmd`](../notebooks/05_Select_Model_2023.Rmd).

## 7. Calibrate probabilities

The saved candidate models are applied to valid 2024 records. Each model gets a
Platt-style logistic calibration adjustment using:

- A calibration intercept
- A calibration slope
- The model's predicted log-odds

The base classifiers are not refit during calibration. Calibration parameters
are saved and later applied unchanged to 2025 predictions.

See [`06_Calibrate_2024.Rmd`](../notebooks/06_Calibrate_2024.Rmd).

## 8. Evaluate the frozen workflow in 2025

The 2025 file is scored using:

1. The saved candidate models
2. The saved 2024 calibration parameters
3. The model family selected using 2023

Predictions are generated for every 2025 record with a valid survey weight.
Outcome filtering occurs only when calculating supervised metrics.

The evaluation reports:

- Survey-weighted AUROC
- Survey-weighted Brier score
- Calibration error
- Observed FMD prevalence
- Mean predicted probability
- Weight-effective sample size
- AI/AN-alone and other-single-race subgroup metrics

See [`07_Evaluate_2025.Rmd`](../notebooks/07_Evaluate_2025.Rmd) and
[`08_AI_AN_Equity_Evaluation.Rmd`](../notebooks/08_AI_AN_Equity_Evaluation.Rmd).

## 9. Additional diagnostics

The complete master workflow also runs the additional analysis notebooks:

- Forward-year predictor reliance
- Demographic composition standardization
- Exploratory standardized-gap uncertainty

These analyses use frozen predictions and do not change the selected model.
They are descriptive or sensitivity analyses rather than additional training
steps.

The expanded model experiments in notebooks 18–23 are separate exploratory
analyses and are not part of the primary model-selection chain. They should be
reported separately from the pre-specified logistic/LASSO/random-forest
workflow.

## Reproducibility

Run [`00_Run_All.Rmd`](../notebooks/00_Run_All.Rmd) to execute the stages in
order. Optional stages are controlled in
[`R/config.Rmd`](../R/config.Rmd). Each execution receives a numbered output
folder. The saved run artifacts keep the training data, fitted models,
calibration objects, tables, figures, and rendered notebooks associated with
one run. Record the run number when reporting results, and do not combine
artifacts from separate runs.

For a complete analysis record, retain the rendered summary notebook, the run
manifest and session-information file, the final tables and figures, the
included source RDS files, and this documentation together.
