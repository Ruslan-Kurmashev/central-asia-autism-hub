export type MchatAnswer = 'yes' | 'no' | null;
export type MchatCategory = 'low' | 'follow-up-required' | 'high';
export interface MchatInitialResult {
  score: number;
  category: MchatCategory;
  followUpRequired: boolean;
  initialStageOnly: true;
}
const reversed = new Set([2, 5, 12]);
export function scoreMchatInitial(answers: readonly MchatAnswer[]): MchatInitialResult {
  if (answers.length !== 20 || answers.some(a => a !== 'yes' && a !== 'no')) {
    throw new Error('M-CHAT-R initial stage requires exactly 20 yes/no answers');
  }
  const score = answers.reduce<number>((total, answer, zeroIndex) => {
    const item = zeroIndex + 1;
    const elevated = reversed.has(item) ? answer === 'yes' : answer === 'no';
    return total + Number(elevated);
  }, 0);
  return {
    score,
    category: score >= 8 ? 'high' : score >= 3 ? 'follow-up-required' : 'low',
    followUpRequired: score >= 3 && score <= 7,
    initialStageOnly: true,
  };
}
