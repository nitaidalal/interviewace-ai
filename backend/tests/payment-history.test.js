import assert from "node:assert/strict";
import test from "node:test";

import Payment from "../src/models/payment.model.js";

// Importing the service initializes the SDK; no provider API is called here.
process.env.RAZORPAY_KEY_ID = "test_key";
process.env.RAZORPAY_KEY_SECRET = "test_secret";
const { getPaymentHistory } = await import("../src/controllers/payment.controller.js");

const userId = "test-user";
const records = Array.from({ length: 63 }, (_, index) => ({
  _id: index + 1,
  user: userId,
  // Matching timestamps exercise the ID tie-breaker between pages.
  createdAt: new Date("2026-01-01T00:00:00Z"),
}));

function mockPayments(t, rows) {
  const matching = (filter) => rows.filter((row) => row.user === filter.user);
  t.mock.method(Payment, "countDocuments", async (filter) => matching(filter).length);
  t.mock.method(Payment, "find", (filter) => {
    let result = matching(filter);
    const query = {
      sort(fields) {
        result.sort((a, b) => {
          for (const [field, direction] of Object.entries(fields)) {
            if (a[field] < b[field]) return -direction;
            if (a[field] > b[field]) return direction;
          }
          return 0;
        });
        return query;
      },
      skip(offset) {
        result = result.slice(offset);
        return query;
      },
      limit(limit) {
        result = result.slice(0, limit);
        return query;
      },
      async lean() {
        return result;
      },
    };
    return query;
  });
}

function requestHistory(query = {}) {
  return new Promise((resolve, reject) => {
    let status;
    getPaymentHistory(
      { user: { id: userId }, query },
      {
        status(value) {
          status = value;
          return this;
        },
        json(body) {
          resolve({ status, body });
        },
      },
      reject,
    );
  });
}

test("history defaults to ten newest orders scoped to the authenticated user", async (t) => {
  mockPayments(t, [...records, { _id: 1000, user: "another-user" }]);
  const { status, body } = await requestHistory({ userId: "another-user", limit: "100" });
  assert.equal(status, 200);
  assert.deepEqual(body.data.payments.map((order) => order._id),
    [63, 62, 61, 60, 59, 58, 57, 56, 55, 54]);
  assert.deepEqual(body.data.pagination, {
    page: 1, limit: 10, totalItems: 63, totalPages: 7,
    hasPreviousPage: false, hasNextPage: true,
  });
});

test("next and previous pages are distinct and older orders beyond fifty remain accessible", async (t) => {
  mockPayments(t, records);
  const first = (await requestHistory()).body.data;
  const second = (await requestHistory({ page: "2" })).body.data;
  assert.equal(second.payments.length, 10);
  assert.equal(second.payments[0]._id, 53);
  assert.ok(second.payments.every((order) =>
    !first.payments.some((other) => other._id === order._id)));
  assert.equal(second.pagination.hasPreviousPage, true);
  assert.equal(second.pagination.hasNextPage, true);
  assert.deepEqual((await requestHistory({ page: "1" })).body.data, first);

  const last = (await requestHistory({ page: "7" })).body.data;
  assert.deepEqual(last.payments.map((order) => order._id), [3, 2, 1]);
  assert.equal(last.pagination.hasNextPage, false);
});

test("an out-of-range page returns the last available page", async (t) => {
  mockPayments(t, records);
  const { body } = await requestHistory({ page: "999" });
  assert.equal(body.data.pagination.page, 7);
  assert.equal(body.data.payments.length, 3);
});

test("empty history returns consistent first-page metadata", async (t) => {
  mockPayments(t, []);
  const { body } = await requestHistory({ page: "5" });
  assert.deepEqual(body.data.payments, []);
  assert.deepEqual(body.data.pagination, {
    page: 1, limit: 10, totalItems: 0, totalPages: 1,
    hasPreviousPage: false, hasNextPage: false,
  });
});

test("invalid pages are rejected before querying the database", async (t) => {
  mockPayments(t, records);
  for (const page of ["0", "-1", "1.5", "abc", "", "1e2", ["1", "2"],
    "9007199254740992"]) {
    await assert.rejects(requestHistory({ page }), (error) => error.statusCode === 400);
  }
  assert.equal(Payment.countDocuments.mock.callCount(), 0);
  assert.equal(Payment.find.mock.callCount(), 0);
});
