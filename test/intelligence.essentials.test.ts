import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getLocalEssentials,
  emergencyNumberList,
  ESSENTIALS_DATA_NOTE,
} from "../src/lib/intelligence/essentials";
import { localEssentials } from "../src/content/essentials";

test("getLocalEssentials returns a record for a known destination, null otherwise", () => {
  assert.equal(getLocalEssentials("kyoto")?.destinationId, "kyoto");
  assert.equal(getLocalEssentials("atlantis"), null);
});

test("every destination has emergency numbers, phrases, etiquette and a language", () => {
  for (const e of localEssentials) {
    assert.ok(e.language.length > 0, `${e.destinationId} language`);
    assert.ok(emergencyNumberList(e).length > 0, `${e.destinationId} emergency`);
    assert.ok(e.keyPhrases.length > 0, `${e.destinationId} phrases`);
    assert.ok(e.etiquetteDos.length > 0 && e.etiquetteDonts.length > 0, `${e.destinationId} etiquette`);
    for (const p of e.keyPhrases) {
      assert.ok(p.en.length > 0 && p.local.length > 0, `${e.destinationId} phrase shape`);
    }
  }
  assert.match(ESSENTIALS_DATA_NOTE, /verify on arrival/i);
});

test("emergencyNumberList puts a universal number first and omits undefined entries", () => {
  const santorini = getLocalEssentials("santorini")!;
  const list = emergencyNumberList(santorini);
  assert.equal(list[0]?.label, "Universal");
  assert.equal(list[0]?.number, "112");
  // Kyoto has no universal number → list starts with Police, no empty slots.
  const kyoto = getLocalEssentials("kyoto")!;
  const kList = emergencyNumberList(kyoto);
  assert.equal(kList[0]?.label, "Police");
  assert.ok(kList.every((n) => n.number.length > 0));
});

test("Japan etiquette includes the no-tipping norm; Morocco includes mosque guidance", () => {
  assert.ok(getLocalEssentials("kyoto")!.etiquetteDonts.some((d) => /tip/i.test(d)));
  assert.ok(getLocalEssentials("marrakech")!.etiquetteDonts.some((d) => /mosque/i.test(d)));
});
