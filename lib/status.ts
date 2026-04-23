export const ALLOWED_STATUSES = ["Coding", "Learning", "Shipping"] as const;

export type StatusValue = (typeof ALLOWED_STATUSES)[number];

export type StatusData = {
  project: string;
  status: StatusValue;
  updatedAt: string;
};

export function isStatusValue(value: string): value is StatusValue {
  return ALLOWED_STATUSES.includes(value as StatusValue);
}

export function normalizeStatus(status: string): StatusValue | null {
  const normalized = status.trim().toLowerCase();
  if (normalized === "coding") return "Coding";
  if (normalized === "learning") return "Learning";
  if (normalized === "shipping") return "Shipping";
  return null;
}
