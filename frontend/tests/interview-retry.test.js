import assert from "node:assert/strict";
import test from "node:test";
import { getRetryAt } from "../src/utils/errorParser.js";

const limited = (retryAfter) => ({
  response: { status: 429, headers: { "retry-after": retryAfter } },
});

test("rate-limit retry uses the server's remaining seconds", () => {
  assert.equal(getRetryAt(limited("42"), 1000), 43000);
  assert.equal(getRetryAt(limited("0"), 1000), 1000);
});

test("HTTP date retry headers are supported and past dates allow immediate retry", () => {
  const now = Date.UTC(2026, 10, 28);
  assert.equal(getRetryAt(limited(new Date(now + 60000).toUTCString()), now), now + 60000);
  assert.equal(getRetryAt(limited(new Date(now - 60000).toUTCString()), now), now);
});

test("missing or malformed rate-limit headers use the backend's 15-minute window", () => {
  for (const value of [undefined, "invalid"]) {
    assert.equal(getRetryAt(limited(value), 1000), 901000);
  }
});

test("network failures and other API errors do not impose a rate-limit cooldown", () => {
  assert.equal(getRetryAt({}), null);
  assert.equal(getRetryAt({ response: { status: 500 } }), null);
});
