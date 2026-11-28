import assert from "node:assert/strict";
import test from "node:test";
import {
  enterInterviewFullscreen,
  exitInterviewFullscreen,
  isInterviewFullscreen,
  watchInterviewFullscreen,
} from "../src/utils/interviewFullscreen.js";

function mockDocument(t) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "document");
  const document = new EventTarget();
  document.fullscreenEnabled = true;
  document.fullscreenElement = null;
  document.documentElement = {};
  document.documentElement.requestFullscreen = t.mock.fn(async () => {
    document.fullscreenElement = document.documentElement;
    document.dispatchEvent(new Event("fullscreenchange"));
  });
  document.exitFullscreen = t.mock.fn(async () => {
    document.fullscreenElement = null;
    document.dispatchEvent(new Event("fullscreenchange"));
  });
  Object.defineProperty(globalThis, "document", { configurable: true, value: document });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, "document", previous);
    else delete globalThis.document;
  });
  return document;
}

test("starting an interview requests fullscreen on the whole document", async (t) => {
  const document = mockDocument(t);
  await enterInterviewFullscreen();
  assert.equal(isInterviewFullscreen(), true);
  assert.equal(document.documentElement.requestFullscreen.mock.callCount(), 1);
  await enterInterviewFullscreen();
  assert.equal(document.documentElement.requestFullscreen.mock.callCount(), 1);
});

test("fullscreen watcher detects Escape-style exit and Cancel-style re-entry", async (t) => {
  const document = mockDocument(t);
  const states = [];
  const stop = watchInterviewFullscreen((fullscreen) => states.push(fullscreen));
  await enterInterviewFullscreen();
  // A browser-originated exit happens before the application sees the event.
  document.fullscreenElement = null;
  document.dispatchEvent(new Event("fullscreenchange"));
  assert.equal(states.at(-1), false);
  await enterInterviewFullscreen();
  assert.deepEqual(states, [false, true, false, true]);
  stop();
});

test("a denied fullscreen request leaves the session blocked and permits retry", async (t) => {
  const document = mockDocument(t);
  const request = document.documentElement.requestFullscreen;
  document.documentElement.requestFullscreen = async () => { throw new Error("Denied"); };
  await assert.rejects(enterInterviewFullscreen(), /Allow fullscreen and try again/);
  assert.equal(isInterviewFullscreen(), false);
  document.documentElement.requestFullscreen = request;
  await enterInterviewFullscreen();
  assert.equal(isInterviewFullscreen(), true);
});

test("unsupported or disabled fullscreen fails with an actionable error", async (t) => {
  const document = mockDocument(t);
  document.fullscreenEnabled = false;
  await assert.rejects(enterInterviewFullscreen(), /browser that supports fullscreen/);
  assert.equal(document.documentElement.requestFullscreen.mock.callCount(), 0);
  document.fullscreenEnabled = true;
  delete document.documentElement.requestFullscreen;
  await assert.rejects(enterInterviewFullscreen(), /Fullscreen is unavailable/);
});

test("ending the session exits fullscreen safely even if the browser already exited", async (t) => {
  const document = mockDocument(t);
  await enterInterviewFullscreen();
  await exitInterviewFullscreen();
  assert.equal(isInterviewFullscreen(), false);
  await exitInterviewFullscreen();
  assert.equal(document.exitFullscreen.mock.callCount(), 1);
});

test("unsubscribing removes the exit listener", async (t) => {
  mockDocument(t);
  const onChange = t.mock.fn();
  const stop = watchInterviewFullscreen(onChange);
  stop();
  await enterInterviewFullscreen();
  await exitInterviewFullscreen();
  assert.equal(onChange.mock.callCount(), 1);
});

test("a fullscreen video does not count as the interview being fullscreen", (t) => {
  const document = mockDocument(t);
  document.fullscreenElement = {};
  assert.equal(isInterviewFullscreen(), false);
});
