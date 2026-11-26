import { log } from "./prompts.js";
import { ConfigError } from "./config.js";
import { RegistryFetchError } from "./fetch.js";
import {
  RegistryNameConflictError,
  RegistryResolutionError
} from "./resolve.js";
import { RegistryValidationError } from "./validate-content.js";

/** Reports expected command failures without a stack trace. */
export function reportCommandError(error: unknown): void {
  if (error instanceof ConfigError) {
    log.error(error.message);
    process.exitCode = 1;
    return;
  }
  if (error instanceof RegistryFetchError) {
    log.error(error.message);
    log.info(
      "Check the registry URL and your network connection. Set LOSETA_REGISTRY or use --registry to point at a mirror."
    );
    process.exitCode = 1;
    return;
  }
  if (error instanceof RegistryValidationError) {
    log.error(error.message);
    if (
      /Unsupported registry schema|requires loseta/.test(error.message)
    ) {
      log.info("Run `npx loseta@latest` to upgrade the CLI.");
    } else {
      log.info("The registry payload was refused and nothing was installed.");
    }
    process.exitCode = 1;
    return;
  }
  if (error instanceof RegistryNameConflictError) {
    log.error(error.message);
    process.exitCode = 1;
    return;
  }
  if (error instanceof RegistryResolutionError) {
    log.error(error.message);
    process.exitCode = 1;
    return;
  }
  throw error;
}
