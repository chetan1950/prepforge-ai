import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { readinessScore } from "@/lib/scoring";

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [attempts, submissions, problemCount, interviewPractices] = await Promise.all([
    db.questionAttempt.findMany({
      where: { userId: user.id },
      include: { question: { select: { category: true } } },
      orderBy: { createdAt: "asc" },
    }),
    db.codingSubmission.findMany({
      where: { userId: user.id },
      include: { problem: true },
      orderBy: { createdAt: "desc" },
    }),
    db.codingProblem.count(),
    db.interviewPractice.findMany({
      where: { userId: user.id },
      select: { id: true, kind: true, topic: true, prompt: true, answer: true, selfRating: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const accuracy = attempts.length
    ? Math.round((attempts.filter((attempt) => attempt.correct).length / attempts.length) * 100)
    : null;
  const solved = new Set(submissions.filter((submission) => submission.status === "Accepted").map((submission) => submission.problemId)).size;
  const coding = solved ? Math.round((solved / Math.max(problemCount, 1)) * 100) : null;
  const technicalRatings = interviewPractices.filter((practice) => practice.kind === "technical");
  const hrRatings = interviewPractices.filter((practice) => practice.kind === "hr");
  const confidence = (items: typeof interviewPractices) => items.length
    ? Math.round(items.reduce((sum, item) => sum + item.selfRating, 0) / items.length * 20)
    : null;
  const technical = confidence(technicalRatings);
  const hr = confidence(hrRatings);
  const scores = [accuracy, coding, technical, hr].filter((score): score is number => score !== null);

  const activityByDate = new Map<string, { label: string; attempted: number; correct: number }>();
  for (const attempt of attempts) {
    const label = attempt.createdAt.toISOString().slice(0, 10);
    const day = activityByDate.get(label) ?? { label, attempted: 0, correct: 0 };
    day.attempted += 1;
    if (attempt.correct) day.correct += 1;
    activityByDate.set(label, day);
  }

  const topicStats = new Map<string, { attempted: number; correct: number }>();
  for (const attempt of attempts) {
    const stats = topicStats.get(attempt.question.category) ?? { attempted: 0, correct: 0 };
    stats.attempted += 1;
    if (attempt.correct) stats.correct += 1;
    topicStats.set(attempt.question.category, stats);
  }

  return NextResponse.json({
    user,
    readiness: readinessScore(scores),
    readinessAreas: scores.length,
    aptitude: { accuracy, attempted: attempts.length },
    coding: { solved, submissions: submissions.length, accuracy: coding },
    technical: { accuracy: technical, attempts: technicalRatings.length },
    hr: { accuracy: hr, attempts: hrRatings.length },
    interviewPractice: { total: interviewPractices.length, recent: interviewPractices.slice(0, 8) },
    activity: [...activityByDate.values()],
    weakTopics: [...topicStats.entries()]
      .map(([topic, stats]) => ({ topic, accuracy: Math.round((stats.correct / stats.attempted) * 100), attempted: stats.attempted }))
      .filter((item) => item.attempted >= 2)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3),
    recentSubmissions: submissions.slice(0, 5).map((submission) => ({
      title: submission.problem.title,
      status: submission.status,
      createdAt: submission.createdAt,
    })),
    hasActivity: attempts.length + submissions.length + interviewPractices.length > 0,
  });
}
