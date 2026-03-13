import { createRequire } from "node:module";
import type { ErrorObject } from "ajv";
import manifestSchema from "./site-manifest.schema.json" with { type: "json" };
import type { SiteManifest } from "../types.js";

const require = createRequire(import.meta.url);

type AjvValidator<T> = ((data: unknown) => data is T) & {
  errors?: ErrorObject[];
};

type AjvInstance = {
  compile: <T>(schema: object) => AjvValidator<T>;
};

const Ajv2020 = require("ajv/dist/2020").default as new (options?: {
  allErrors?: boolean;
  strict?: boolean;
}) => AjvInstance;

const addFormats = require("ajv-formats").default as (ajv: AjvInstance) => void;

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
});

addFormats(ajv);

const validator = ajv.compile<SiteManifest>(manifestSchema);

/**
 * Wraps schema validation failures in a single error object that is easy for callers to catch and display.
 */
export class ManifestValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Invalid site manifest:\n${issues.map((issue) => `- ${issue}`).join("\n")}`);
    this.name = "ManifestValidationError";
    this.issues = issues;
  }
}

/**
 * Runs the manifest through the JSON Schema validator and returns human-readable issue strings.
 */
export function getManifestValidationErrors(manifest: unknown): string[] {
  const valid = validator(manifest);

  if (valid) {
    return [];
  }

  return (validator.errors ?? []).map((error) => {
    const path = error.instancePath || "/";
    return `${path} ${error.message ?? "is invalid"}`.trim();
  });
}

/**
 * Provides a boolean guard for code paths that only need to know whether the manifest is schema-compliant.
 */
export function isValidManifest(manifest: unknown): manifest is SiteManifest {
  return getManifestValidationErrors(manifest).length === 0;
}

/**
 * Ensures a manifest is valid before it is used elsewhere, throwing a detailed error when validation fails.
 */
export function validateManifest<T extends SiteManifest>(manifest: T): T {
  const issues = getManifestValidationErrors(manifest);

  if (issues.length > 0) {
    throw new ManifestValidationError(issues);
  }

  return manifest;
}
