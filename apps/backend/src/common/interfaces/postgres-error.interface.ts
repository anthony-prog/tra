export interface PostgresError {
  code: string;
  constraint?: string;
  message?: string;
  detail?: string;
  hint?: string;
  where?: string;
  schema?: string;
  table?: string;
  column?: string;
  dataType?: string;
}
