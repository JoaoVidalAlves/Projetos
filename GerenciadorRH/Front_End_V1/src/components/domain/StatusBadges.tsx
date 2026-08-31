import type { Status, JobStatus } from "../../types";
import { STATUS_STYLES, JOB_STATUS_STYLES, MODALITY_STYLES, DEFAULT_MODALITY_STYLE } from "../../utils/statusConfig";
import { Badge } from "../ui/Badge";

export function StatusBadge({ status }: { status: Status }) {
  const style = STATUS_STYLES[status];
  return (
    <Badge className={style.badgeClass} dotClassName={style.dotClass}>
      {style.label}
    </Badge>
  );
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const style = JOB_STATUS_STYLES[status];
  return (
    <Badge className={style.badgeClass} dotClassName={style.dotClass}>
      {style.label}
    </Badge>
  );
}

export function ModalityBadge({ modality }: { modality: string }) {
  return <Badge className={MODALITY_STYLES[modality] ?? DEFAULT_MODALITY_STYLE}>{modality}</Badge>;
}
