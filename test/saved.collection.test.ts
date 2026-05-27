import { test } from "node:test";
import assert from "node:assert/strict";
import { toggleId, parseSaved } from "../src/lib/saved/collection";

test("toggleId adds then removes", () => {
  let ids: readonly string[] = [];
  ids = toggleId(ids, "kyoto");
  assert.deepEqual([...ids], ["kyoto"]);
  ids = toggleId(ids, "kyoto");
  assert.deepEqual([...ids], []);
});

test("toggleId preserves other ids", () => {
  const ids = toggleId(["a", "b"], "c");
  assert.deepEqual([...ids], ["a", "b", "c"]);
  assert.deepEqual([...toggleId(["a", "b", "c"], "b")], ["a", "c"]);
});

test("parseSaved tolerates junk and non-string entries", () => {
  assert.deepEqual(parseSaved(null), []);
  assert.deepEqual(parseSaved("not json"), []);
  assert.deepEqual(parseSaved('["a",1,"b",null]'), ["a", "b"]);
  assert.deepEqual(parseSaved('{"x":1}'), []);
});
