export interface Saveable {
  loadFromJson(data: JSON): void;
  saveToJson(): JSON;
}
