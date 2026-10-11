export interface FileWriter {
  write(row: string): Promise<void>;
  end(): Promise<void>;
}
