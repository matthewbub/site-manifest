import { describe, expect, it } from "vitest";
import * as pkg from "../src/index.js";

describe("public exports", () => {
  it("exposes the intended runtime API", () => {
    expect(pkg).toMatchObject({
      createLabelSet: expect.any(Function),
      defineSiteManifest: expect.any(Function),
      getField: expect.any(Function),
      getSection: expect.any(Function),
      getManifestValidationErrors: expect.any(Function),
      isValidManifest: expect.any(Function),
      validateManifest: expect.any(Function),
      weddingManifest: expect.any(Object),
    });
  });
});
