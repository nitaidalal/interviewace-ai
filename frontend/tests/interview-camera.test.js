import assert from "node:assert/strict";
import test from "node:test";
import { prepareInterviewCamera } from "../src/utils/interviewCamera.js";

function mockNavigator(t, getUserMedia) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { mediaDevices: { getUserMedia } },
  });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, "navigator", previous);
    else delete globalThis.navigator;
  });
}

test("camera preparation waits for permission and releases the preview before Start", async (t) => {
  let grant;
  const stop = t.mock.fn();
  const getUserMedia = t.mock.fn(() => new Promise((resolve) => { grant = resolve; }));
  mockNavigator(t, getUserMedia);
  let ready = false;
  const pending = prepareInterviewCamera().then(() => { ready = true; });
  await Promise.resolve();
  assert.equal(ready, false);
  assert.deepEqual(getUserMedia.mock.calls[0].arguments[0], {
    video: { width: 320, height: 240, facingMode: "user" },
    audio: false,
  });
  grant({ getTracks: () => [{ stop }] });
  await pending;
  assert.equal(ready, true);
  assert.equal(stop.mock.callCount(), 1);
});

test("StrictMode replay shares the pending camera permission request", async (t) => {
  let grant;
  const getUserMedia = t.mock.fn(() => new Promise((resolve) => { grant = resolve; }));
  mockNavigator(t, getUserMedia);
  const first = prepareInterviewCamera();
  const second = prepareInterviewCamera();
  assert.equal(first, second);
  assert.equal(getUserMedia.mock.callCount(), 1);
  grant({ getTracks: () => [] });
  await first;
});

test("denying camera access still allows starting a camera-off interview", async (t) => {
  mockNavigator(t, async () => { throw new Error("Permission denied"); });
  await assert.doesNotReject(prepareInterviewCamera());
});
