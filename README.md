# FMD Project

This project contains the R analysis for my capstone project on classifying
frequent mental distress (FMD) in BRFSS survey data and examining model performance
for AI/AN-alone adults.

## Research questions

How accurately do machine-learning models classify self-reported frequent mental
distress among U.S. adults using BRFSS demographic, socioeconomic, and health-related
characteristics, and does model predictive performance differ between American Indian and
Alaska Native adults and non-AI/AN adults?

The primary question is whether models trained on earlier annual BRFSS surveys
can classify frequent mental distress in later survey years using physical
health, general health, income, education, age, and sex.

The secondary question is whether the selected national model has different
discrimination and calibration for AI/AN-alone adults and other identified
single-race adults. Race is not used as a model predictor or as a criterion for
selecting the national model.

Frequent mental distress (FMD) is defined as reporting 14 or more mentally
unhealthy days in the past 30 days. This is a repeated cross-sectional
classification study, not individual-level forecasting or a clinical
diagnostic tool.

## Running the project

1. Open `FMD_Project.Rproj` in RStudio. The notebooks locate the project by
this filename, so keep the `.Rproj` file in the project folder.
2. Confirm that `analysis_pooled_2014_2024.rds` and `full_slim_2025.rds` 
are present in `data/processed/`. These processed source files are included 
with this project.
3. Open `notebooks/00_Install_Packages.Rmd` and run it once to install the 
required packages.
4. Run `tests/00_Test_Synthetic.Rmd` to check the core helper functions.
5. Choose `"quick"` or `"full"` in `R/config.Rmd`, then knit 
`notebooks/00_Run_All.Rmd`.

The master notebook runs the analysis stages in order and writes each execution
to its own numbered directory under `outputs/`.
Rendered stage notebooks are written to that run's `notebooks/` subdirectory;
the source `notebooks/` directory contains only the executable R Markdown
files.
The additional predictor, composition, and uncertainty analyses are included in
that same master run rather than requiring a separate follow-up run.

## Run numbering and outputs

Each complete execution receives the next number from
`outputs/run_counter.txt`. The same number is used for all models, tables,
figures, checkpoints, and rendered notebooks created during that execution.
`outputs/active_run.txt` records the most recent run for stage-level work.

Use the master notebook to begin a fresh analysis. Do not combine artifacts
from different run numbers. If a run stops partway through, check the output
directory before rerunning an individual stage to prevent errors.

## Reproducibility and saved outputs

The project includes the two processed source RDS files, but not a complete
regenerated run. The `outputs/` directory contains run metadata and selected
supplemental artifacts; it is not a substitute for rerunning the analysis from
the source data. Each complete `outputs/run_NNNN/` directory
preserves the artifacts associated with one execution, including tables,
figures, models, logs, checkpoints, and rendered notebooks.

Run the master notebook from this project after confirming the two source files
are present in `data/processed/`. Keep the resulting run directory together and
report its run number when sharing figures or tables. Do not combine artifacts
from different runs.

Adjustments to this workflow would be required if the original source data are
updated, or if the analysis is run on a different machine.

## Analysis record

The reproducible analysis record consists of the source RDS inputs, the
numbered run directory, rendered notebooks, final tables and figures, model
objects, run manifest, and session-information file. The processed source
inputs are included in `data/processed/` for reproducibility.

## Analysis sequence

| Years     | Purpose                                                     |
| --------- | ----------------------------------------------------------- |
| 2014–2022 | Train classifiers and fit forward-year validation folds     |
| 2023      | Select the national model family using weighted Brier score |
| 2024      | Fit probability calibration without using 2025 outcomes     |
| 2025      | Evaluate the selected model, subgroup metrics, and additional diagnostics |

## Project structure

- `R/config.Rmd`: model settings, predictors, feature levels, and optional
  diagnostics.
- `R/run_manager.Rmd`: run numbering and artifact paths.
- `R/helpers.Rmd`: data checks, preprocessing, modeling, weighting, and
  evaluation helpers.
- `notebooks/`: executable analysis stages and additional diagnostics.
- `tests/`: synthetic checks that do not use the original records.
- `docs/`: research protocol, workflow documentation, design limitations, and
  reproducibility material.
- `docs/DATASET_README.md`: dataset coverage, respondent counts, variables, and
  processing notes.
- `docs/TRAINING_README.md`: model-training timeline, predictors, sampling,
  weighting, validation, calibration, and evaluation steps.
- `data/processed/`: included processed survey RDS inputs and metadata.
- `outputs/`: run counter, run logs, and generated analysis artifacts.

## Scope and limitations

Evaluation includes weighted AUROC, weighted Brier score, calibration measures,
observed FMD prevalence, mean predicted probability, and weight-effective
sample size using CDC supplied weights from BRFSS.

The comparison group is other identified single-race respondents, not all
non-Indigenous adults. Multiracial and unresolved records require separate
interpretation as the BRFSS does not capture all relevant demographic information
related to multiracial category. Differences across survey years may
also reflect changes in sampling, response patterns, jurisdictions, and
recoding.
