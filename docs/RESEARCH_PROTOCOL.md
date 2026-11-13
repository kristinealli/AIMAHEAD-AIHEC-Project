# Research protocol and hypotheses

## Aims

1. **Future-year generalization:** Evaluate whether age, sex, education, income, physical-health days, and self-reported general health classify FMD in later survey years better than a prevalence-only benchmark. Compare physical-only, social/demographic-only, and combined logistic models on 2023 as a secondary descriptive analysis.
2. **Subgroup reliability:** Examine the 2023-selected model after 2025 scoring, estimating group differences in weighted AUROC, Brier score, mean calibration error and risk-decile calibration for AI/AN-alone and other identified single-race adults.
3. **Sensitivity:** Describe outcome/predictor nonresponse and assess whether subgroup results differ when restricting the evaluation to jurisdictions represented in both 2024 and 2025.

## H1

The model developed on earlier years will have lower weighted Brier error than a prevalence-only model in later survey years. This is a testable prediction hypothesis; model complexity alone does not establish improvement. Brier is the main model-family selection metric; AUROC is an important secondary measure.

## H2

The selected national model may differ in discrimination and calibration between the AI/AN-alone and other identified single-race groups. **No direction or significance is assumed**. All subgroup results are evaluated after national model selection, not used to change the 2023-selected winner.

## Training/evaluation timeline

- Train 2014–2022 (computationally sampled with inverse sampling weights), rolling-origin within training data.
- Validate and choose model using all eligible 2023 respondents.
- Calibrate with eligible 2024 respondents.
- Evaluate all 2025 respondents with valid outcome and weight; keep missing outcomes for response audits.

## Interpretation boundaries

- FMD is 14+ mentally unhealthy days in past month, not a psychiatric diagnosis.
- A model trained on earlier **annual surveys** and evaluated on later **annual surveys** is an out-of-time classifier, not a prospective individual predictor.
- Physical health and general health were self-reported contemporaneously with mental health; variables can share response biases and do not establish causal pathways.
- Race is never an input feature. AI/AN alone vs comparison is a subgroup-performance analysis, not a model that infers tribal affiliation.
- Historical comparison group is other **identified single-race** respondents, not all non-AI/AN persons. Multiracial and unresolved race categories are audited separately.
- Design-based group means are not design-based AUROC confidence intervals. Do not claim a statistically established AUROC gap.
- The 2025 outcomes are held out from model development and calibration, so the final evaluation is performed only after the model is frozen.
- Annual original recoding, weight harmonization, changing participating jurisdictions, and small AI/AN effective sample sizes remain research limitations.

## Supplemental analyses

The project includes the following supplemental analyses after the primary
2025 evaluation:

1. Compare the 2025 selected-model Brier error with the **same frozen** national
   baseline separately in each population. Raw Brier errors are not directly
   comparable when outcome prevalence differs.
2. Characterize temporal change in observed annual FMD and input-distribution
   drift. Annual survey estimates are descriptive and do not establish causes.
3. Estimate exploratory fixed-model subgroup AUROC uncertainty through a
   within-stratum PSU resampling approximation with shared replicates for the
   groups. **This is not a substitute for official BRFSS replicate-weight
   variance estimation or uncertainty from model fitting.**
4. Describe 2023 predictor reliance using permuted Brier-error deterioration.
   This measures predictive association, not a modifiable causal determinant.

These analyses use frozen model artifacts and are reported as descriptive or
sensitivity analyses where their methods do not provide full model-fitting or
complex-survey uncertainty. They do not change the nationally selected model.
