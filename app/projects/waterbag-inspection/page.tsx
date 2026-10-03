import type { Metadata } from "next";
import { projectNames } from "../../../lib/project-presentation";
import { IndustrialVisionInspection } from "../../../components/compact-cases/IndustrialVisionInspection";
import "../../../components/compact-cases/compact-cases.css";
export const metadata: Metadata = { title: projectNames["waterbag-inspection"].zh + " | 王凯豪工程案例", description: "多光源 Burst 成像、袋级组包、两阶段检测、Bag ID 有序分拣和 JSONL 追溯链路。" };
export default function Page() { return <IndustrialVisionInspection />; }
