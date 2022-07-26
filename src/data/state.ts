import type { TransitionFnId } from "@/lib/three/transitions";
import { Colors, type Color } from "@/utils/color";
import { Vector3 } from "three";

// export enum Direction {
//   None = 0,
//   Left = 1 << 0, // 0001
//   Right = 1 << 1, // 0010
//   Up = 1 << 2, // 0100
//   Down = 1 << 3, // 1000
// }

export type PointerType = "circle" | "box";
export type OffsetDirection = "left" | "right" | "bottom" | "top";

type NonEmptyArray<T> = [T, ...T[]];
type CaseStudyId = string;
type StageADT = "baseline" | "week24" | "week52";
type ViewADT = "fundus" | "oct" | "fa";
type Hotspot = {
  label: string;
  pointerType: "circle";
  worldspaceCoordinates: Vector3;
  labelOffset: OffsetDirection;
  labelLength: `${number}px`;
  pointerType: PointerType;
};

export enum Grading {
  Baseline,
  Mild,
  Moderate,
  ModeratelySevere,
  Severe,
  VerySevere,
}

type NumberADT = { tag: "number"; value: number };
type EnumerationADT = {
  tag: "enumeration";
  value: number;
  enumeration: string;
};
type NumericalStringADT = {
  tag: "numerical-string";
  value: number;
  stringRep: string;
};
type Metric = NumberADT | EnumerationADT | NumericalStringADT;

export type TreatmentEffectMetrics = {
  NPDR_grading: Metric;
  DRSS: Metric;
  CRT: Metric;
  EDTRS: Metric;
  snellen_equivalent: Metric;
};

type AnnotatedImage = {
  label: string;
  hotspots: Array<Hotspot>;
  aspect_ratio: number;
  url: string;
  mirrored: boolean;
};
type BaselineCharacteristics = {
  gender: string;
  study_eye: "Right" | "Left";
  duration_of_diabetes: number;
  HbA: number;
  age: number;
};
type ClinicalHistory = {
  occular_history: string;
  medical_history: string;
  concommitant_medications: string;
};

type Views = Record<ViewADT, NonEmptyArray<AnnotatedImage>>;
type Stages = Record<
  StageADT,
  { views: Views; metrics: TreatmentEffectMetrics }
>;
type Transition = {
  temporal: {
    from: { [key in StageADT]: Array<TransitionFnId> };
    to: { [key in StageADT]: Array<TransitionFnId> };
  };
  positional: {
    from: { [key in ViewADT]: Array<TransitionFnId> };
    to: { [key in ViewADT]: Array<TransitionFnId> };
  };
};
type CaseStudy = {
  id: CaseStudyId;
  colorId: Color;
  profile_picture: string;
  baseline_characteristics: BaselineCharacteristics;
  clinical_history: ClinicalHistory;
  stages: Stages;
  transitions: Transition;
  enabled: boolean;
};

const caseStudies: Array<CaseStudy> = [
  {
    id: "1",
    enabled: true,
    colorId: Colors.eyleablue,
    profile_picture: "./case-studies/placeholder-profile-female.jpg",
    baseline_characteristics: {
      gender: "male",
      study_eye: "Right",
      duration_of_diabetes: 0.49,
      HbA: 5.9,
      age: 48,
    },
    clinical_history: {
      occular_history: "Both eyes: cataract. Study eye: DR",
      medical_history:
        "Alcoholism, hypertriglyceridemia, lower gastrointestinal hemorrhage, peripheral neuropathy, type 2 diabetes mellitus, vasectomy",
      concommitant_medications:
        "gabapentin, glipizide, ibuprofen, iron supplements, lidocaine, metformin, phenylephrine, povidone-iodine, proxymetacaine, tropicamide",
    },
    transitions: {
      temporal: {
        from: {
          baseline: ["DISPLACE_OUT"],
          week24: ["DISPLACE_OUT"],
          week52: ["DISPLACE_OUT"],
        },
        to: {
          baseline: ["DISPLACE_IN"],
          week24: ["DISPLACE_IN"],
          week52: ["DISPLACE_IN"],
        },
      },
      positional: {
        from: {
          fundus: [],
          oct: [],
          fa: [],
        },
        to: {
          fundus: [],
          oct: [],
          fa: [],
        },
      },
    },
    stages: {
      baseline: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Severe",
            value: Grading.Severe,
          },
          DRSS: { tag: "number", value: 53 },
          CRT: { tag: "number", value: 265 },
          EDTRS: { tag: "number", value: 80 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.18, 0.2, 0),
                  labelOffset: "top",
                  labelLength: "40px",
                },
                {
                  label: "Dot Heamorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.32, 0.2, 0),
                  labelOffset: "bottom",
                  labelLength: "300px",
                },
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.28, 0.07, 0),
                  labelOffset: "right",
                  labelLength: "90px",
                },
                {
                  label: "Venous Beading",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.16, -0.15, 0),
                  labelOffset: "right",
                  labelLength: "90px",
                },
              ],
              label:
                "Given the severity of the NPDR, it is likely that this patient has had type 2 diabetes mellitus much longer than 6 months. There are numerous intraretinal hemorrhages and microaneurysms, particularly in the temporal macula",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Photo/baseline.jpg",
              mirrored: false,
            },
          ],
          fa: [
            {
              label:
                "Given the severity of the NPDR, it is likely that this patient has had type 2 diabetes mellitus much longer than 6 months. There are numerous intraretinal hemorrhages and microaneurysms, particularly in the temporal macula",
              hotspots: [
                {
                  label: "Leakage From Blood Vessel",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.2, 0.26, 0),
                  labelOffset: "right",
                  labelLength: "60px",
                },
                {
                  label: "Microaneuryism",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.32, -0.3, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Angiogram/baseline.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "The OCT image gives the suggestion of mild intraretinal cysts, although the central subfield thickness (CST) is still normal relative to age-matched controls",
              hotspots: [
                {
                  label: "Mild Intraretinal Cysts",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.32, 0.11, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Retina_OCT/baseline.jpg",
              mirrored: false,
            },
          ],
        },
      },
      week24: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Mild",
            value: Grading.Mild,
          },
          DRSS: { tag: "number", value: 35 },
          CRT: { tag: "number", value: 223 },
          EDTRS: { tag: "number", value: 85 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 20,
            stringRep: "20 / 20",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.05, 0.33, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
              ],

              label:
                "3 step improvement. Significant reduction in the number of microaneurysms and their associated leakage.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Photo/week-24.jpg",
              mirrored: false,
            },
          ],

          fa: [
            {
              label:
                "3 step improvement. Significant reduction in the number of microaneurysms and their associated leakage.",
              hotspots: [
                {
                  label: "Microaneuryism",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.32, -0.3, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],

              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Angiogram/week-24.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "3 step improvement. Improvement in visual acuity and reduction in CST, suggesting the presence of subclinical DME at initial evaluation.",
              hotspots: [
                {
                  label: "Reduction in Macular Thickness",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.15, 0.11, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Retina_OCT/week-24.jpg",
              mirrored: false,
            },
          ],
        },
      },
      week52: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Mild",
            value: Grading.Mild,
          },
          DRSS: { tag: "number", value: 35 },
          CRT: { tag: "number", value: 202 },
          EDTRS: { tag: "number", value: 83 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.18, 0.2, 0),
                  labelOffset: "left",
                  labelLength: "40px",
                },
              ],
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of note, the patient has developed hard exudate in the superior macula without associated macular edema. That finding, combined with further reduction in CST, supports the idea of treatment of subclinical DME in conjunction with NPDR.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Photo/week-52.jpg",
              mirrored: false,
            },
          ],

          fa: [
            {
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of note, the patient has developed hard exudate in the superior macula without associated macular edema. That finding, combined with further reduction in CST, supports the idea of treatment of subclinical DME in conjunction with NPDR.",
              hotspots: [
                {
                  label: "Microaneuryism",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.32, -0.3, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Angiogram/week-52.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of note, the patient has developed hard exudate in the superior macula without associated macular edema. That finding, combined with further reduction in CST, supports the idea of treatment of subclinical DME in conjunction with NPDR.",
              hotspots: [
                {
                  label: "Further Reduction in Macular Thickness",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.15, 0.11, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Retina_OCT/week-52.jpg",
              mirrored: false,
            },
          ],
        },
      },
    },
  },
  {
    id: "2",
    enabled: true,
    colorId: Colors.eyleablue,
    profile_picture: "./case-studies/placeholder-profile-female.jpg",
    baseline_characteristics: {
      gender: "female",
      study_eye: "Right",
      duration_of_diabetes: 16.54,
      HbA: 10.2,
      age: 49,
    },
    clinical_history: {
      occular_history: "Both eyes: DR, dry eye. Study eye: cataract nuclear",
      medical_history:
        "Anxiety, gastroesophageal reflux disease, hypercholesterolemia, hyperparathyroidism, hypertension, hysterectomy, peripheral neuropathy, tonsillectomy, type 2 diabetes mellitus",
      concommitant_medications:
        "atorvastatin, bromfenac, carmellose, citalopram, difluprednate, gabapentin, insulin detemir, insulin lispro, lisinopril, metformin, pioglitazone, ranitidine",
    },
    transitions: {
      temporal: {
        from: {
          baseline: ["DISPLACE_OUT"],
          week24: ["DISPLACE_OUT"],
          week52: ["DISPLACE_OUT"],
        },
        to: {
          baseline: ["DISPLACE_IN"],
          week24: ["DISPLACE_IN"],
          week52: ["DISPLACE_IN"],
        },
      },
      positional: {
        from: {
          fundus: [],
          oct: [],
          fa: [],
        },
        to: {
          fundus: [],
          oct: [],
          fa: [],
        },
      },
    },
    stages: {
      baseline: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Severe",
            value: Grading.Severe,
          },
          DRSS: { tag: "number", value: 53 },
          CRT: { tag: "number", value: 236 },
          EDTRS: { tag: "number", value: 79 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 32,
            stringRep: "20 / 32",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Microaneuryisms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.27, 0.07, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
                {
                  label: "Dot Hemorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.36, 0.2, 0),
                  labelOffset: "top",
                  labelLength: "100px",
                },
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.18, 0.2, 0),
                  labelOffset: "right",
                  labelLength: "60px",
                },
                {
                  label: "Venous Dilation",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.25, 0.04, 0),
                  labelOffset: "top",
                  labelLength: "90px",
                },
                {
                  label: "Venous Beading",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.18, -0.11, 0),
                  labelOffset: "bottom",
                  labelLength: "70px",
                },
              ],
              label:
                "The important clinical findings are severe intraretinal hemorrhages and microaneurysms and significant venous dilatation/beading in the color photograph.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_02/Fundus_Photo/baseline.jpg",
              mirrored: false,
            },
          ],
          fa: [
            {
              label:
                "On fluorescein angiography, the patient has significant macular nonperfusion, which is fairly close to the macula",
              hotspots: [
                {
                  label: "Leakage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.1, 0.25, 0),
                  labelOffset: "right",
                  labelLength: "40px",
                },
                {
                  label: "Macular Nonperfusion",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.125, 0.15, 0),
                  labelOffset: "bottom",
                  labelLength: "100px",
                },
                {
                  label: "Aneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.225, -0.175, 0),
                  labelOffset: "right",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_02/Fundus_Angiogram/baseline.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "The retinal findings, combined with poorly controlled type 2 diabetes mellitus, place the patient at significant risk of progression to proliferative diabetic retinopathy.",
              hotspots: [
                {
                  label: "Intra Retinal Hemorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.17, 0.08, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_02/Retina_OCT/baseline.jpg",
              mirrored: false,
            },
          ],
        },
      },
      week24: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Moderate",
            value: Grading.Moderate,
          },
          DRSS: { tag: "number", value: 43 },
          CRT: { tag: "number", value: 211 },
          EDTRS: { tag: "number", value: 84 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Microaneuryisms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.27, 0.07, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
                {
                  label: "Dot Hemorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.02, 0.425, 0),
                  labelOffset: "right",
                  labelLength: "100px",
                },
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.18, 0.2, 0),
                  labelOffset: "right",
                  labelLength: "60px",
                },

                {
                  label: "Venous Beading",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.27, -0.18, 0),
                  labelOffset: "bottom",
                  labelLength: "70px",
                },
              ],

              label:
                "2 step improvement. At Week 24, the number of intraretinal hemorrhages and their associated leakage has been reduced significantly.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_02/Fundus_Photo/week-24.jpg",
              mirrored: false,
            },
          ],

          fa: [
            {
              label:
                "2 step improvement. This is consistent with observations from numerous anti-VEGF clinical trials, including VIVID, VISTA, and PANORAMA, which demonstrated improvement in DR severity with EYLEA.",
              hotspots: [
                {
                  label: "Macular Nonperfusion",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.125, 0.15, 0),
                  labelOffset: "bottom",
                  labelLength: "100px",
                },
                {
                  label: "Aneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.225, -0.175, 0),
                  labelOffset: "right",
                  labelLength: "60px",
                },
              ],

              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_02/Fundus_Angiogram/week-24.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "2 step improvement. The number of intraretinal hemorrhages and their associated leakage has been reduced significantly.",
              hotspots: [
                {
                  label: "Intra Retinal Hemorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.2, 0.08, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_02/Retina_OCT/week-24.jpg",
              mirrored: false,
            },
          ],
        },
      },
      week52: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Moderate",
            value: Grading.Moderate,
          },
          DRSS: { tag: "number", value: 42 },
          CRT: { tag: "number", value: 207 },
          EDTRS: { tag: "number", value: 84 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Dot Hemorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.2, -0.025, 0),
                  labelOffset: "right",
                  labelLength: "100px",
                },
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.18, 0.2, 0),
                  labelOffset: "right",
                  labelLength: "60px",
                },
              ],
              label:
                "2 step improvement. The 2-step improvement seen at Week 24 persists, as well as improvement in visual acuity and CST reduction. There has been no change in the macular nonperfusion seen at baseline. ",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Photo/week-52.jpg",
              mirrored: false,
            },
          ],

          fa: [
            {
              label:
                "2 step improvement. The 2-step improvement seen at Week 24 persists, as well asimprovement in visual acuity and CST reduction. There has beenno change in the macular nonperfusion seen at baseline",
              hotspots: [
                {
                  label: "Macular Nonperfusion",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.125, 0.15, 0),
                  labelOffset: "bottom",
                  labelLength: "100px",
                },
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.35, -0.4, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_02/Fundus_Angiogram/week-52.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "2 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of note, the patient has developed hard exudate in the superior macula without associated macular edema. That finding, combined with further reduction in CST, supports the idea of treatment of subclinical DME in conjunction with NPDR.",
              hotspots: [
                {
                  label: "Intra Retinal Hemorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.38, 0.08, 0),
                  labelOffset: "left",
                  labelLength: "90px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_02/Retina_OCT/week-52.jpg",
              mirrored: false,
            },
          ],
        },
      },
    },
  },
  {
    id: "3",
    enabled: true,
    colorId: Colors.eyleablue,
    profile_picture: "./case-studies/placeholder-profile-female.jpg",
    baseline_characteristics: {
      gender: "Male",
      study_eye: "Right",
      duration_of_diabetes: 12.68,
      HbA: 9.7,
      age: 53,
    },
    clinical_history: {
      occular_history:
        "Both eyes: arteriovenous crossing vessels, DR, retinal hemorrhage, pinguecula Study eye: Intraretinal microvascular abnormalities",
      medical_history:
        "Arthralgia, asthma, bronchial hyperreactivity, carpal tunnel decompression, chest pain, chronic obstructive pulmonary disease, depression, diabetes mellitus, dyspnea, erectile dysfunction, hyperlipidemia, hypertension, onychomycosis, peripheral neuropathy, sciatica, seasonal allergies, sleep apnea, tinea pedis, vitamin D deficiency, xerosis",
      concommitant_medications:
        "albuterol, aspirin, clotrimazole,cholecalciferol, fluorescein, fluorescein/proxymetacaine, gabapentin, glyceryl trinitrate, insulin aspart, insulin detemir, lidocaine, lisinopril, loratadine, metformin, mometasone, ofloxacin, phenylephrine, povidone-iodine, proxymetacaine, sildenafil, simvastatin, sitagliptin, tramadol, tropicamide, urea",
    },
    transitions: {
      temporal: {
        from: {
          baseline: ["DISPLACE_OUT"],
          week24: ["DISPLACE_OUT"],
          week52: ["DISPLACE_OUT"],
        },
        to: {
          baseline: ["DISPLACE_IN"],
          week24: ["DISPLACE_IN"],
          week52: ["DISPLACE_IN"],
        },
      },
      positional: {
        from: {
          fundus: [],
          oct: [],
          fa: [],
        },
        to: {
          fundus: [],
          oct: [],
          fa: [],
        },
      },
    },
    stages: {
      baseline: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Moderately Severe",
            value: Grading.ModeratelySevere,
          },
          DRSS: { tag: "number", value: 47 },
          CRT: { tag: "number", value: 239 },
          EDTRS: { tag: "number", value: 87 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 20,
            stringRep: "20 / 20",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Microaneuryisms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.15, -0.125, 0),
                  labelOffset: "bottom",
                  labelLength: "40px",
                },
                {
                  label: "Dot Hemorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.225, -0.09, 0),
                  labelOffset: "top",
                  labelLength: "100px",
                },
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0, 0.38, 0),
                  labelOffset: "bottom",
                  labelLength: "60px",
                },
                {
                  label: "Venous Beading",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.01, -0.16, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
              ],
              label:
                "This patient presents with poorly-controlled type 2 diabetes mellitus and a host of chronic medical conditions, which likely require numerous office visits to a number of healthcare providers. The presence of moderately severe NPDR will necessitate surveillance exams every 4 months. Following the 16-week dosing strategy evaluated in PANORAMA can match up with visits every 4 months..  ",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_03/Fundus_Photo/baseline.jpg",
              mirrored: false,
            },
          ],
          fa: [
            {
              label:
                "This patient presents with poorly-controlled type 2 diabetes mellitus and a host of chronic medical conditions, which likely require numerous office visits to a number of healthcare providers. The presence of moderately severe NPDR will necessitate surveillance exams every 4 months. Following the 16-week dosing strategy evaluated in PANORAMA can match up with visits every 4 months",
              hotspots: [
                {
                  label: "Venous Leakage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.28, 0.23, 0),
                  labelOffset: "bottom",
                  labelLength: "100px",
                },
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.35, -0.35, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_03/Fundus_Angiogram/baseline.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "This patient presents with poorly-controlled type 2 diabetes mellitus and a host of chronic medical conditions, which likely require numerous office visits to a number of healthcare providers. The presence of moderately severe NPDR will necessitate surveillance exams every 4 months. Following the 16-week dosing strategy evaluated in PANORAMA can match up with visits every 4 months.",
              hotspots: [
                {
                  label: "Hemorrhage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.1, 0.08, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_03/Retina_OCT/baseline.jpg",
              mirrored: false,
            },
          ],
        },
      },
      week24: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Moderate",
            value: Grading.Moderate,
          },
          DRSS: { tag: "number", value: 43 },
          CRT: { tag: "number", value: 211 },
          EDTRS: { tag: "number", value: 84 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Microaneuryisms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.15, -0.125, 0),
                  labelOffset: "bottom",
                  labelLength: "40px",
                },
                {
                  label: "Hemorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.225, 0, 0),
                  labelOffset: "top",
                  labelLength: "100px",
                },
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0, 0.38, 0),
                  labelOffset: "left",
                  labelLength: "90px",
                },
                {
                  label: "Venous Beading",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.025, 0.185, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
              ],

              label:
                "2 step improvement. In PANORAMA, patients with level 47 retinopathy were less likely t. experience a 2-step regression in DR severity. The most likely reaso. for that was less severe disease at baseline, as seen in this case. Here, the number of microaneurysms are significantly less at Week 24, and the primary outcome was met.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_03/Fundus_Photo/week-24.jpg",
              mirrored: false,
            },
          ],

          fa: [
            {
              label:
                "2 step improvement. In PANORAMA, patients with level 47 retinopathy were less likely t. experience a 2-step regression in DR severity. The most likely reaso. for that was less severe disease at baseline, as seen in this case. Here, the number of microaneurysms are significantly less at Week 24, and the primary outcome was met.",

              hotspots: [
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.35, -0.35, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],

              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_03/Fundus_Angiogram/week-24.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "2 step improvement. In PANORAMA, patients with level 47 retinopathy were less likely t. experience a 2-step regression in DR severity. The most likely reaso. for that was less severe disease at baseline, as seen in this case. Here, the number of microaneurysms are significantly less at Week 24, and the primary outcome was met.",
              hotspots: [
                {
                  label: "Hemorrhage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.35, 0.08, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_03/Retina_OCT/week-24.jpg",
              mirrored: false,
            },
          ],
        },
      },
      week52: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Moderate",
            value: Grading.Moderate,
          },
          DRSS: { tag: "number", value: 42 },
          CRT: { tag: "number", value: 207 },
          EDTRS: { tag: "number", value: 84 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Microaneuryisms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.15, -0.125, 0),
                  labelOffset: "bottom",
                  labelLength: "40px",
                },
                {
                  label: "Hemorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.285, -0.062, 0),
                  labelOffset: "top",
                  labelLength: "100px",
                },
              ],
              label:
                "2 step improvement.At Week 52, the treatment effect is maintained.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_03/Fundus_Photo/week-52.jpg",
              mirrored: false,
            },
          ],

          fa: [
            {
              label:
                "2 step improvement.At Week 52, the treatment effect is maintained.",
              hotspots: [
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.35, -0.35, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_03/Fundus_Angiogram/week-52.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "2 step improvement.At Week 52, the treatment effect is maintained.",
              hotspots: [
                {
                  label: "Hemorrhage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.37, 0.08, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_03/Retina_OCT/week-52.jpg",
              mirrored: false,
            },
          ],
        },
      },
    },
  },
  {
    id: "4",
    enabled: true,
    colorId: Colors.eyleablue,
    profile_picture: "./case-studies/placeholder-profile-female.jpg",
    baseline_characteristics: {
      gender: "Female",
      study_eye: "Left",
      duration_of_diabetes: 1.58,
      HbA: 6.6,
      age: 76,
    },
    clinical_history: {
      occular_history: "Both eyes: cataract. Study eye: DR",
      medical_history:
        "Alcoholism, hypertriglyceridemia, lower gastrointestinal hemorrhage, peripheral neuropathy, type 2 diabetes mellitus, vasectomy ",
      concommitant_medications:
        "gabapentin, glipizide, ibuprofen, iron supplements, lidocaine, metformin, phenylephrine, povidone-iodine, proxymetacaine, tropicamide ",
    },
    transitions: {
      temporal: {
        from: {
          baseline: ["DISPLACE_OUT"],
          week24: ["DISPLACE_OUT"],
          week52: ["DISPLACE_OUT"],
        },
        to: {
          baseline: ["DISPLACE_IN"],
          week24: ["DISPLACE_IN"],
          week52: ["DISPLACE_IN"],
        },
      },
      positional: {
        from: {
          fundus: [],
          oct: [],
          fa: [],
        },
        to: {
          fundus: [],
          oct: [],
          fa: [],
        },
      },
    },
    stages: {
      baseline: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Severe",
            value: Grading.Severe,
          },
          DRSS: { tag: "number", value: 53 },
          CRT: { tag: "number", value: 265 },
          EDTRS: { tag: "number", value: 80 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Hemorrhage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.24, 0.03, 0),
                  labelOffset: "bottom",
                  labelLength: "40px",
                },
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.18, 0.2, 0),
                  labelOffset: "top",
                  labelLength: "100px",
                },
                {
                  label: "Dot Hemorrhage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.32, 0.15, 0),
                  labelOffset: "bottom",
                  labelLength: "60px",
                },
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.23, 0.025, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
                {
                  label: "Venous Beading",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.15, -0.25, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
                {
                  label: "Cotton Wool Spot",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.05, -0.2, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
              ],
              label:
                "Given the severity of the NPDR, it is likely that this patient has had type 2 diabetes mellitus much longer than 6 months. There are numerous intraretinal hemorrhages and microaneurysms, particularly in the temporal macula.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Photo/baseline.jpg",
              mirrored: true,
            },
          ],
          fa: [
            {
              label:
                "Given the severity of the NPDR, it is likely that this patient has had type 2 diabetes mellitus much longer than 6 months. There are numerous intraretinal hemorrhages and microaneurysms, particularly in the temporal macula.",

              hotspots: [
                {
                  label: "Leakage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.05, 0.225, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.152, -0.18, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Angiogram/baseline.jpg",
              mirrored: true,
            },
          ],
          oct: [
            {
              label:
                "The OCT image gives the suggestion of mild intraretinal cysts, although the central subfield thickness (CST) is still normal relative to age-matched controls",
              hotspots: [
                {
                  label: "Intra-retinal hemorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.35, 0.08, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Retina_OCT/baseline.jpg",
              mirrored: true,
            },
          ],
        },
      },
      week24: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Moderate",
            value: Grading.Moderate,
          },
          DRSS: { tag: "number", value: 43 },
          CRT: { tag: "number", value: 211 },
          EDTRS: { tag: "number", value: 84 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Hemorrhage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.24, 0.03, 0),
                  labelOffset: "bottom",
                  labelLength: "40px",
                },
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.23, 0.025, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
                {
                  label: "Cotton Wool Spot",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.05, -0.2, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
              ],

              label:
                "3 step improvement significant reduction in the number of microaneurysms and their associated leakage.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Photo/week-24.jpg",
              mirrored: true,
            },
          ],

          fa: [
            {
              label:
                "3 step improvement significant reduction in the number of microaneurysms and their associated leakage.",

              hotspots: [
                {
                  label: "Leakage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.08, 0.06, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.152, -0.18, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
              ],

              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Angiogram/week-24.jpg",
              mirrored: true,
            },
          ],
          oct: [
            {
              label:
                "3 step improvement improvement in visual acuity and reduction in CST, suggesting the presence of subclinical DME at initial evaluation. ",
              hotspots: [
                {
                  label: "Hemorrhage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.35, 0.08, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Retina_OCT/week-24.jpg",
              mirrored: true,
            },
          ],
        },
      },
      week52: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Mild",
            value: Grading.Mild,
          },
          DRSS: { tag: "number", value: 35 },
          CRT: { tag: "number", value: 202 },
          EDTRS: { tag: "number", value: 83 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Hemorrhage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.24, 0.03, 0),
                  labelOffset: "bottom",
                  labelLength: "40px",
                },
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.23, 0.025, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
                {
                  label: "Cotton Wool Spot",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.05, -0.2, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
              ],
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of. note, the patient has developed hard exudate in the superior macula. without associated macular edema. That finding, combined with. further reduction in CST, supports the idea of treatment of subclinical. DME in conjunction with NPDR",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Photo/week-52.jpg",
              mirrored: true,
            },
          ],

          fa: [
            {
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of. note, the patient has developed hard exudate in the superior macula. without associated macular edema. That finding, combined with. further reduction in CST, supports the idea of treatment of subclinical. DME in conjunction with NPDR",
              hotspots: [
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.152, -0.18, 0),
                  labelOffset: "right",
                  labelLength: "70px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Angiogram/week-52.jpg",
              mirrored: true,
            },
          ],
          oct: [
            {
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of. note, the patient has developed hard exudate in the superior macula. without associated macular edema. That finding, combined with. further reduction in CST, supports the idea of treatment of subclinical. DME in conjunction with NPDR",
              hotspots: [
                {
                  label: "Hemorrhage",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.35, 0.08, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Retina_OCT/week-52.jpg",
              mirrored: true,
            },
          ],
        },
      },
    },
  },
  {
    id: "5",
    enabled: true,
    colorId: Colors.eyleablue,
    profile_picture: "./case-studies/placeholder-profile-female.jpg",
    baseline_characteristics: {
      gender: "Male",
      study_eye: "Left",
      duration_of_diabetes: 0.5,
      HbA: 4.8,
      age: 38,
    },
    clinical_history: {
      occular_history: "Both eyes: cataract. Study eye: DR",
      medical_history:
        "Alcoholism, hypertriglyceridemia, lower gastrointestinal hemorrhage, peripheral neuropathy, type 2 diabetes mellitus, vasectomy ",
      concommitant_medications:
        "gabapentin, glipizide, ibuprofen, iron supplements, lidocaine, metformin, phenylephrine, povidone-iodine, proxymetacaine, tropicamide ",
    },
    transitions: {
      temporal: {
        from: {
          baseline: ["DISPLACE_OUT"],
          week24: ["DISPLACE_OUT"],
          week52: ["DISPLACE_OUT"],
        },
        to: {
          baseline: ["DISPLACE_IN"],
          week24: ["DISPLACE_IN"],
          week52: ["DISPLACE_IN"],
        },
      },
      positional: {
        from: {
          fundus: [],
          oct: [],
          fa: [],
        },
        to: {
          fundus: [],
          oct: [],
          fa: [],
        },
      },
    },
    stages: {
      baseline: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Severe",
            value: Grading.Severe,
          },
          DRSS: { tag: "number", value: 53 },
          CRT: { tag: "number", value: 265 },
          EDTRS: { tag: "number", value: 80 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [],
              label:
                "Given the severity of the NPDR, it is likely that this patient has had type 2 diabetes mellitus much longer than 6 months. There are numerous intraretinal hemorrhages and microaneurysms, particularly in the temporal macula.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Photo/baseline.jpg",
              mirrored: false,
            },
          ],
          fa: [
            {
              label:
                "Given the severity of the NPDR, it is likely that this patient has had type 2 diabetes mellitus much longer than 6 months. There are numerous intraretinal hemorrhages and microaneurysms, particularly in the temporal macula.",

              hotspots: [],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Angiogram/baseline.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "The OCT image gives the suggestion of mild intraretinal cysts, although the central subfield thickness (CST) is still normal relative to age-matched controls",
              hotspots: [],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Retina_OCT/baseline.jpg",
              mirrored: false,
            },
          ],
        },
      },
      week24: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Moderate",
            value: Grading.Moderate,
          },
          DRSS: { tag: "number", value: 43 },
          CRT: { tag: "number", value: 211 },
          EDTRS: { tag: "number", value: 84 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [],

              label:
                "3 step improvement significant reduction in the number of microaneurysms and their associated leakage.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Photo/week-24.jpg",
              mirrored: false,
            },
          ],

          fa: [
            {
              label:
                "3 step improvement significant reduction in the number of microaneurysms and their associated leakage.",

              hotspots: [],

              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Angiogram/week-24.jpg",

              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "3 step improvement improvement in visual acuity and reduction in CST, suggesting the presence of subclinical DME at initial evaluation. ",
              hotspots: [],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Retina_OCT/week-24.jpg",
              mirrored: false,
            },
          ],
        },
      },
      week52: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Mild",
            value: Grading.Mild,
          },
          DRSS: { tag: "number", value: 35 },
          CRT: { tag: "number", value: 202 },
          EDTRS: { tag: "number", value: 83 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [],
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of. note, the patient has developed hard exudate in the superior macula. without associated macular edema. That finding, combined with. further reduction in CST, supports the idea of treatment of subclinical. DME in conjunction with NPDR",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Photo/week-52.jpg",
              mirrored: false,
            },
          ],

          fa: [
            {
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of. note, the patient has developed hard exudate in the superior macula. without associated macular edema. That finding, combined with. further reduction in CST, supports the idea of treatment of subclinical. DME in conjunction with NPDR",
              hotspots: [],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Fundus_Angiogram/week-52.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of. note, the patient has developed hard exudate in the superior macula. without associated macular edema. That finding, combined with. further reduction in CST, supports the idea of treatment of subclinical. DME in conjunction with NPDR",
              hotspots: [],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_04/Retina_OCT/week-52.jpg",
              mirrored: false,
            },
          ],
        },
      },
    },
  },
  {
    id: "6",
    enabled: true,
    colorId: Colors.eyleablue,
    profile_picture: "./case-studies/placeholder-profile-female.jpg",
    baseline_characteristics: {
      gender: "unknown",
      study_eye: "Right",
      duration_of_diabetes: 10.48,
      HbA: 10,
      age: 59,
    },
    clinical_history: {
      occular_history: "",
      medical_history: "",
      concommitant_medications: "",
    },
    transitions: {
      temporal: {
        from: {
          baseline: ["DISPLACE_OUT"],
          week24: ["DISPLACE_OUT"],
          week52: ["DISPLACE_OUT"],
        },
        to: {
          baseline: ["DISPLACE_IN"],
          week24: ["DISPLACE_IN"],
          week52: ["DISPLACE_IN"],
        },
      },
      positional: {
        from: {
          fundus: [],
          oct: [],
          fa: [],
        },
        to: {
          fundus: [],
          oct: [],
          fa: [],
        },
      },
    },
    stages: {
      baseline: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Moderately Severe",
            value: Grading.ModeratelySevere,
          },
          DRSS: { tag: "number", value: 47 },
          CRT: { tag: "number", value: 280 },
          EDTRS: { tag: "number", value: 83 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 20,
            stringRep: "20 / 20",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.18, 0.2, 0),
                  labelOffset: "top",
                  labelLength: "40px",
                },
                {
                  label: "Dot Heamorrhages",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.32, 0.2, 0),
                  labelOffset: "bottom",
                  labelLength: "300px",
                },
                {
                  label: "Microaneurysms",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.28, 0.07, 0),
                  labelOffset: "right",
                  labelLength: "90px",
                },
                {
                  label: "Venous Beading",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.16, -0.15, 0),
                  labelOffset: "right",
                  labelLength: "90px",
                },
              ],
              label:
                "Given the severity of the NPDR, it is likely that this patient has had type 2 diabetes mellitus much longer than 6 months. There are numerous intraretinal hemorrhages and microaneurysms, particularly in the temporal macula",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Photo/baseline.jpg",
              mirrored: false,
            },
          ],
          fa: [
            {
              label:
                "Given the severity of the NPDR, it is likely that this patient has had type 2 diabetes mellitus much longer than 6 months. There are numerous intraretinal hemorrhages and microaneurysms, particularly in the temporal macula",
              hotspots: [
                {
                  label: "Leakage From Blood Vessel",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.2, 0.26, 0),
                  labelOffset: "right",
                  labelLength: "60px",
                },
                {
                  label: "Microaneuryism",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.32, -0.3, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Angiogram/baseline.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "The OCT image gives the suggestion of mild intraretinal cysts, although the central subfield thickness (CST) is still normal relative to age-matched controls",
              hotspots: [
                {
                  label: "Mild Intraretinal Cysts",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(0.32, 0.11, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Retina_OCT/baseline.jpg",
              mirrored: false,
            },
          ],
        },
      },
      week24: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Mild",
            value: Grading.Mild,
          },
          DRSS: { tag: "number", value: 35 },
          CRT: { tag: "number", value: 223 },
          EDTRS: { tag: "number", value: 85 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 20,
            stringRep: "20 / 20",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.05, 0.33, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
              ],

              label:
                "3 step improvement. Significant reduction in the number of microaneurysms and their associated leakage.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Photo/week-24.jpg",
              mirrored: false,
            },
          ],

          fa: [
            {
              label:
                "3 step improvement. Significant reduction in the number of microaneurysms and their associated leakage.",
              hotspots: [
                {
                  label: "Microaneuryism",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.32, -0.3, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],

              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Angiogram/week-24.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "3 step improvement. Improvement in visual acuity and reduction in CST, suggesting the presence of subclinical DME at initial evaluation.",
              hotspots: [
                {
                  label: "Reduction in Macular Thickness",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.15, 0.11, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Retina_OCT/week-24.jpg",
              mirrored: false,
            },
          ],
        },
      },
      week52: {
        metrics: {
          NPDR_grading: {
            tag: "enumeration",
            enumeration: "Mild",
            value: Grading.Mild,
          },
          DRSS: { tag: "number", value: 35 },
          CRT: { tag: "number", value: 202 },
          EDTRS: { tag: "number", value: 83 },
          snellen_equivalent: {
            tag: "numerical-string",
            value: 20 / 25,
            stringRep: "20 / 25",
          },
        },
        views: {
          fundus: [
            {
              hotspots: [
                {
                  label: "Hard Exudates",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.18, 0.2, 0),
                  labelOffset: "left",
                  labelLength: "40px",
                },
              ],
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of note, the patient has developed hard exudate in the superior macula without associated macular edema. That finding, combined with further reduction in CST, supports the idea of treatment of subclinical DME in conjunction with NPDR.",
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Photo/week-52.jpg",
              mirrored: false,
            },
          ],

          fa: [
            {
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of note, the patient has developed hard exudate in the superior macula without associated macular edema. That finding, combined with further reduction in CST, supports the idea of treatment of subclinical DME in conjunction with NPDR.",
              hotspots: [
                {
                  label: "Microaneuryism",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.32, -0.3, 0),
                  labelOffset: "top",
                  labelLength: "60px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Fundus_Angiogram/week-52.jpg",
              mirrored: false,
            },
          ],
          oct: [
            {
              label:
                "3 step improvement. The reduction of microaneurysms seen at Week 24 persists. Of note, the patient has developed hard exudate in the superior macula without associated macular edema. That finding, combined with further reduction in CST, supports the idea of treatment of subclinical DME in conjunction with NPDR.",
              hotspots: [
                {
                  label: "Further Reduction in Macular Thickness",
                  pointerType: "circle",
                  worldspaceCoordinates: new Vector3(-0.15, 0.11, 0),
                  labelOffset: "bottom",
                  labelLength: "90px",
                },
              ],
              aspect_ratio: 3840 / 3840,
              url: "./case-studies/Case_Study_01/Retina_OCT/week-52.jpg",
              mirrored: false,
            },
          ],
        },
      },
    },
  },
];

export type {
  AnnotatedImage,
  CaseStudy,
  Views,
  Stages,
  Hotspot,
  StageADT,
  ViewADT,
  ClinicalHistory,
  BaselineCharacteristics,
  Metric,
};
export { caseStudies };
