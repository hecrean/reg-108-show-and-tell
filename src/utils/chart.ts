import type {
  CaseStudy,
  Metric,
  StageADT,
  TreatmentEffectMetrics,
} from "@/data/state";
import type { Color } from "@/utils/color";

export type NoData = { tag: "no-data"; msg: string };
export const nodata = (msg: string = "no data") => ({ tag: "no-data", msg });

export type Dataset = {
  datasetId: string;
  points: Array<{ x: number; y: number; yType: Metric["tag"]; yAlt: string }>;
  variableNames: { x: string; y: string };
  units: { x: string; y: string };
  meta: { color: Color };
};

const stages: Array<StageADT> = ["baseline", "week24", "week52"];

export const metricsLens = (caseStudy: CaseStudy, stage: StageADT) =>
  caseStudy.stages[stage].metrics;

const mapStageKeyToNumber = (stage: StageADT) => {
  switch (stage) {
    case "baseline":
      return 0;
    case "week24":
      return 24;
    case "week52":
      return 52;
  }
};
const mapMetricKeyToLabel = (
  metricKey: keyof TreatmentEffectMetrics
): string => {
  switch (metricKey) {
    case "CRT":
      return "Central Retinal Thickness";
    case "DRSS":
      return "DRS";
    case "EDTRS":
      return "EDTRS";
    case "NPDR_grading":
      return "Nonproliferative Diabetic Retinopathy (Severity Grading)";
    case "snellen_equivalent":
      return "Snellen Equivalent";
  }
};

const mapMetricKeyToUnits = (
  metricKey: keyof TreatmentEffectMetrics
): string => {
  switch (metricKey) {
    case "CRT":
      return "µm";
    case "DRSS":
      return "";
    case "EDTRS":
      return "";
    case "NPDR_grading":
      return "";
    case "snellen_equivalent":
      return "";
  }
};

const mapToStringRep = (metric: Metric): string => {
  switch (metric.tag) {
    case "enumeration":
      return metric.enumeration;
    case "number":
      return String(metric.value);
    case "numerical-string":
      return metric.stringRep;
  }
};

const timeset = (
  caseStudy: CaseStudy,
  stages: Array<StageADT>,
  metricKey: keyof TreatmentEffectMetrics
): Array<{ x: number; y: number; yType: Metric["tag"]; yAlt: string }> =>
  stages.map((stage) => ({
    x: mapStageKeyToNumber(stage),
    y: metricsLens(caseStudy, stage)[metricKey].value,
    yType: metricsLens(caseStudy, stage)[metricKey].tag,
    yAlt: mapToStringRep(metricsLens(caseStudy, stage)[metricKey]),
  }));

export const datasetFn = (
  caseStudy: CaseStudy,
  stages: Array<StageADT>,
  metricKey: keyof TreatmentEffectMetrics
): Dataset => ({
  datasetId: caseStudy.id,
  points: timeset(caseStudy, stages, metricKey),
  variableNames: { x: "Time", y: mapMetricKeyToLabel(metricKey) },
  units: { x: "Weeks", y: mapMetricKeyToUnits(metricKey) },
  meta: { color: caseStudy.colorId },
});

export const largest = (xs: Array<number>) =>
  xs.reduce((prev, curr) => (curr > prev ? curr : prev), 0);
