# SOP: Start / Continue / End Prompts

## New Chat Start Prompt
We are building ForgeSiteDiary (construction PM daily diary).
Hard rules:
- PowerShell only, one step per reply, always start with cd + dir.
- No explanations, just what to do and what to report back.
- Never assume; ask for files if needed.
- Frequent milestone commits + pushes.
Roadmap is locked; always reference it to stay on track.
Current milestone: M0 repo + baseline skeleton.
My GitHub user: dcljlong. Repo may not exist yet.
I have Supabase available if required.
Tell me the next single PowerShell step.

## Continue Project Prompt
Continue ForgeSiteDiary.
Roadmap: M0 repo+baseline, M1 data+rollover, M2 lock dashboard, M3 jobs+diary, M4 priority surfacing, M5 calendar, M6 photos, M7 reports, M8 auth/sync.
Rules: PowerShell only, one step per reply, always cd + dir first, no assumptions, milestone commits + pushes.
Here is my current status/output from last step:
<PASTE OUTPUT HERE>
Give the next single PowerShell step.

## End of Session Prompt
End session for ForgeSiteDiary.
Produce:
1) Current milestone and what’s completed
2) What changed today (files touched)
3) Exact next step to run tomorrow (single PowerShell block)
4) Any risks/blocks
5) Reminder of locked rules + roadmap checkpoint
