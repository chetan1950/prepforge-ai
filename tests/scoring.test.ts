import {describe,it} from "node:test";
import assert from "node:assert/strict";
import {readinessScore} from "../src/lib/scoring";
describe("readinessScore",()=>{
 it("averages only performance areas with real scores",()=>assert.equal(readinessScore([60,80]),70));
 it("does not count unavailable areas as zeros",()=>assert.equal(readinessScore([100,Number.NaN]),100));
 it("reports zero when there is no recorded activity",()=>assert.equal(readinessScore([]),0));
});
