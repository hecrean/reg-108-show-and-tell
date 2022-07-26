import { writable } from "svelte/store";
import type { CaseStudy } from "@/data/state";
import { caseStudies } from "@/data/state";

export const caseStudyStore = writable<CaseStudy>(caseStudies[0]);
