import { v4 as uuidv4 } from "uuid";

export function getTimestampLocal(): string {
  return new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
}

export function generarUUID(): string {
  return uuidv4();
}