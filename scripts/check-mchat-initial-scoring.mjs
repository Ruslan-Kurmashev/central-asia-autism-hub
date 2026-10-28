import assert from 'node:assert/strict';
import { scoreMchatInitial } from '../src/lib/mchat-initial-scoring.ts';

const safe = Array(20).fill('yes');
for (const number of [2,5,12]) safe[number-1] = 'no';
assert.deepEqual(scoreMchatInitial(safe), {
  score: 0, category: 'low', followUpRequired: false, initialStageOnly: true
});
const allElevated = safe.map((answer, i) => [2,5,12].includes(i+1) ? 'yes' : 'no');
assert.equal(scoreMchatInitial(allElevated).score, 20);
for (let score=0;score<=20;score++) {
  const answers=[...safe];
  for(let i=0;i<score;i++) answers[i]=allElevated[i];
  const result=scoreMchatInitial(answers);
  assert.equal(result.score, score);
  assert.equal(result.category, score<=2?'low':score<=7?'follow-up-required':'high');
  assert.equal(result.followUpRequired, score>=3&&score<=7);
}
assert.throws(()=>scoreMchatInitial(Array(19).fill('yes')));
assert.throws(()=>scoreMchatInitial(Array(20).fill(null)));
assert.throws(()=>scoreMchatInitial([...safe.slice(0,19),'maybe']));
console.log('[MCHAT_INITIAL] 21 scores and all validation cases passed; Follow-Up is intentionally not simulated');
