export const buildATSPrompt = (resumeText) => `
You are a professional resume reviewer and ATS (Applicant Tracking System) expert.
Analyze the following resume and return a structured evaluation.

Resume Text:
"""
${resumeText}
"""

Evaluate the resume across exactly 14 criteria. For each criterion, provide:
- score: integer from 0 to 10
- feedback: 1-2 sentences of specific, actionable feedback

Criteria to evaluate:
1. structure         — overall document structure and section organization
2. readability       — ease of reading, white space, section clarity
3. grammar           — grammatical correctness and spelling
4. professionalLanguage — professional tone and vocabulary
5. skillsSection     — presence and quality of skills section
6. projectsSection   — presence and quality of projects section
7. experienceSection — quality of work experience descriptions
8. educationSection  — completeness and formatting of education
9. formatting        — consistent font, bullet style, date formatting
10. actionVerbs      — use of strong action verbs to start bullet points
11. bulletImpact     — whether bullets show measurable impact and results
12. keywordOptimization — presence of industry-relevant technical keywords
13. missingInfo      — important sections or information that are absent
14. overallQuality   — holistic assessment of resume quality

Also provide:
- overallScore: integer 0-100 (AI-estimated ATS compatibility)
- strengths: array of 3 specific things done well
- improvements: array of 5 specific actionable improvements
- missingKeywords: array of 5-8 technical keywords that should be added

IMPORTANT:
- Be specific — reference actual content from the resume
- Be constructive — focus on how to improve
- overallScore must reflect ATS compatibility honestly
- Return ONLY valid JSON, no markdown, no explanation

Return this exact JSON structure:
{
  "overallScore": 0-100,
  "sections": {
    "structure":            { "score": 0-10, "feedback": "..." },
    "readability":          { "score": 0-10, "feedback": "..." },
    "grammar":              { "score": 0-10, "feedback": "..." },
    "professionalLanguage": { "score": 0-10, "feedback": "..." },
    "skillsSection":        { "score": 0-10, "feedback": "..." },
    "projectsSection":      { "score": 0-10, "feedback": "..." },
    "experienceSection":    { "score": 0-10, "feedback": "..." },
    "educationSection":     { "score": 0-10, "feedback": "..." },
    "formatting":           { "score": 0-10, "feedback": "..." },
    "actionVerbs":          { "score": 0-10, "feedback": "..." },
    "bulletImpact":         { "score": 0-10, "feedback": "..." },
    "keywordOptimization":  { "score": 0-10, "feedback": "..." },
    "missingInfo":          { "score": 0-10, "feedback": "..." },
    "overallQuality":       { "score": 0-10, "feedback": "..." }
  },
  "strengths":       ["...", "...", "..."],
  "improvements":    ["...", "...", "...", "...", "..."],
  "missingKeywords": ["...", "...", "...", "...", "...", "...", "..."]
}
`;
