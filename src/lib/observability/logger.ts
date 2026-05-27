/**
 * Minimal structured logger (no dependencies).
 *
 * Emits one JSON object per line so logs are machine-parseable by any log
 * pipeline. This is the seam the platform's observability stack plugs into;
 * `formatLog` is pure and unit-tested. See
 * docs/architecture/monitoring-observability-architecture.md.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogFields = Record<string, unknown>;

export interface LogRecord {
  readonly level: LogLevel;
  readonly msg: string;
  readonly time: string;
  readonly fields?: LogFields;
}

/** Pure: build the structured record. Separated from emission for testability. */
export function formatLog(
  level: LogLevel,
  msg: string,
  fields?: LogFields,
): LogRecord {
  return {
    level,
    msg,
    time: new Date().toISOString(),
    ...(fields && Object.keys(fields).length > 0 ? { fields } : {}),
  };
}

function emit(record: LogRecord): void {
  const line = JSON.stringify(record);
  // warn/error to stderr, everything else to stdout — standard stream hygiene.
  if (record.level === "warn" || record.level === "error") {
    console.error(line);
  } else {
    console.log(line);
  }
}

export const log = {
  debug: (msg: string, fields?: LogFields) => emit(formatLog("debug", msg, fields)),
  info: (msg: string, fields?: LogFields) => emit(formatLog("info", msg, fields)),
  warn: (msg: string, fields?: LogFields) => emit(formatLog("warn", msg, fields)),
  error: (msg: string, fields?: LogFields) => emit(formatLog("error", msg, fields)),
};
