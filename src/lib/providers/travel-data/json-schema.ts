/**
 * JSON Schema export for the travel-data contracts.
 *
 * Turns the zod contract schemas (`./schemas`) into plain JSON Schema documents.
 * This is the seam that lets external tooling consume the contracts without a
 * TypeScript dependency: OpenAPI generation, client-SDK code generation, and
 * request/response validation in other runtimes.
 *
 * Pure and side-effect free — it describes shapes, it does not fetch anything.
 * Uses zod's v4 `toJSONSchema` (shipped inside `zod@3.25`); see `./schemas`.
 */
import { z } from "zod/v4";
import type { JSONSchema } from "zod/v4/core";

import { travelDataSchemas, type TravelDataSchemaName } from "./schemas";

/** A JSON Schema document (draft 2020-12 by default). */
export type JsonSchema = JSONSchema.BaseSchema;

/** JSON Schema dialects zod can target. */
export type JsonSchemaTarget = "draft-2020-12" | "draft-7";

export interface JsonSchemaExportOptions {
  /** Target dialect. Defaults to JSON Schema draft 2020-12. */
  readonly target?: JsonSchemaTarget;
}

/** Export the JSON Schema for one named contract. */
export function travelDataJsonSchema(
  name: TravelDataSchemaName,
  options: JsonSchemaExportOptions = {},
): JsonSchema {
  return z.toJSONSchema(travelDataSchemas[name], { target: options.target ?? "draft-2020-12" });
}

/**
 * Export JSON Schemas for every named contract, keyed by contract name. This is
 * the document an OpenAPI `components.schemas` block or an SDK generator would
 * consume.
 */
export function travelDataJsonSchemas(
  options: JsonSchemaExportOptions = {},
): Record<TravelDataSchemaName, JsonSchema> {
  const out = {} as Record<TravelDataSchemaName, JsonSchema>;
  for (const name of Object.keys(travelDataSchemas) as TravelDataSchemaName[]) {
    out[name] = travelDataJsonSchema(name, options);
  }
  return out;
}

/** The stable list of exported contract names. */
export function travelDataSchemaNames(): readonly TravelDataSchemaName[] {
  return Object.keys(travelDataSchemas) as TravelDataSchemaName[];
}
