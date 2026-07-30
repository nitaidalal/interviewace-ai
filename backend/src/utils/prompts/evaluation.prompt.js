export const buildFeedbackPrompt = ({
  question,
  candidateAnswer,
  stackContext,
  experience,
  timedOut,
  isCodingQuestion,
}) => {
  const answerContext = timedOut
    ? `The candidate ran out of time and did not submit a complete answer.
       Answer submitted: "${candidateAnswer || "No answer provided"}"`
    : `Candidate Answer: "${candidateAnswer}"`;

  return `You are a senior ${stackContext} interviewer reviewing a candidate's answer.

Candidate Experience: ${experience.years} years (${experience.level})
${isCodingQuestion ? "This was a coding question." : ""}

Question: "${question}"
${answerContext}

Evaluate this answer and return ONLY this JSON — no markdown, no extra text:
{
  "shortFeedback":
  "Write concise interviewer feedback.
  
  Rules:
  - Maximum 30 words.
  - Maximum 2 sentences.
  - Sound like a real senior interviewer.
  - Focus only on the candidate's answer.
  - Mention one strength OR one missing concept.
  - Do NOT explain the complete solution.
  - Do NOT use motivational or filler phrases.
  - Do NOT repeat the candidate's answer.
  
  If timedOut is true:
  - Mention that the candidate ran out of time.
  - Briefly state the main concepts expected.
  - Do not criticize harshly."${
    timedOut
      ? "Acknowledge the time ran out, be professional and encouraging."
      : "Be honest but constructive."
  }",
  "improvedAnswer": "4-5 lines explaining the ideal answer properly. ${
    isCodingQuestion
      ? "Include the correct approach and key logic points."
      : "Include key concepts, real-world context, and best practices."
  }",
  "questionScore": <number 0-10>
}

Scoring guide:
  0-2: No answer or completely wrong
  3-4: Very basic or mostly incorrect
  5-6: Partially correct, missing key points
  7-8: Good answer with minor gaps
  9-10: Excellent, comprehensive answer

IMPORTANT: Return valid JSON only. No extra text.`;
};

// ─── Final Evaluation Prompt ──────────────────────────────────────

export const buildEvaluationPrompt = ({
  answers,
  settings,
  stackContext,
  userName,
}) => {
  const answersText = answers
    .map(
      (a) =>
        `Q${a.questionIndex}: ${a.questionContent}\n` +
        `Answer: ${a.candidateAnswer || "No answer"}\n` +
        `Score: ${a.questionScore}/10`,
    )
    .join("\n\n");

  return `You are evaluating a complete mock interview session for ${userName}.

Interview Type: ${stackContext}
Difficulty: ${settings.difficulty}
Candidate Experience: ${settings.experience.years} years (${settings.experience.level})

Full Interview Q&A:
${answersText}

Provide a holistic evaluation of the candidate's overall interview performance.

Return ONLY this JSON — no markdown, no extra text:
{
  "categoryScores": {
    "communication": <0-10>,
    "technical": <0-10>,
    "confidence": <0-10>,
    "problemSolving": <0-10>
  },
  "strengths": [
    "specific strength 1",
    "specific strength 2",
    "specific strength 3"
  ],
  "weaknesses": [
    "specific weakness 1",
    "specific weakness 2"
  ],
  "suggestions": [
    "actionable suggestion 1",
    "actionable suggestion 2",
    "actionable suggestion 3"
  ]
}

Rules:
- categoryScores must reflect overall performance across all answers
- strengths, weaknesses, suggestions must be specific — not generic
- suggestions must be actionable and practical
- Base everything on the actual answers provided
- IMPORTANT: Return valid JSON only`;
};
