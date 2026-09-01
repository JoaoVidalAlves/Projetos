import { X, MapPin, Phone, Mail, Briefcase, Star, Calendar } from "lucide-react";
import type { Candidate, Status } from "../../types";
import { Avatar } from "../../components/domain";
import { Select } from "../../components/ui/Select";
import { ALL_STATUSES } from "../../utils/domainOptions";
import { formatDate } from "../../utils/formatters";
import { getExperienceMonths } from "../../utils/experience";

interface CandidateDetailPanelProps {
  candidate: Candidate;
  onClose: () => void;
  onStatusChange: (id: string, status: Status) => void;
}

export function CandidateDetailPanel({ candidate, onClose, onStatusChange }: CandidateDetailPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white border-l border-line">
      <div className="flex items-start justify-between p-5 border-b border-line">
        <div className="flex items-center gap-3">
          <Avatar name={candidate.name} size="lg" />
          <div>
            <h2 className="font-display font-semibold text-base">{candidate.name}</h2>
            <p className="text-xs text-muted mt-0.5">
              {candidate.position} · {candidate.department}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-paper rounded-sm transition-colors">
          <X size={16} className="text-muted" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Status do processo</p>
          <Select value={candidate.status} onChange={(e) => onStatusChange(candidate.id, e.target.value as Status)}>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Informações</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={13} className="text-muted" />
              <a href={`mailto:${candidate.email}`} className="text-accent hover:underline">
                {candidate.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={13} className="text-muted" />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={13} className="text-muted" />
              <span>{candidate.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase size={13} className="text-muted" />
              <span>{candidate.experience} de experiência</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={13} className="text-muted" />
              <span>Candidatura em {formatDate(candidate.appliedDate)}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Habilidades</p>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <span key={skill} className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3 bg-accent-soft border border-accent/20 rounded-sm flex items-center gap-2">
          <Star size={13} className="text-accent-dark" />
          <span className="text-xs font-medium">{getExperienceMonths(candidate.experience)} meses de experiência (Caminho B)</span>
        </div>
      </div>
    </div>
  );
}
