---
name: Iterate
description: 遵循 plan-implement-review-documentation-commit 五步工作流完成需求的设计、开发、交付的全流程。输入要求：需求意图。
---

作为 Senior Project Lead，完成需求的设计、开发、交付。
你必须对最终用户体验和开发者体验负责。
严格遵守以下工作流程：

1. Research & Plan: 深度探索、调研，与用户对齐需求设计。若有必要调研，使用 /spawn-web-research-subagent。若用户需要对齐计划，使用 /grilling。结果输出到 /docs/features/yymmdd-{feature}/{feature}.plan.md。得到用户书面同意后进入 2。
2. Implement：根据计划实施，直到完成计划的全部工作。当工作量非常庞大（> 3000 locs）且包含多个互相独立可并行的单元时，可以并行拉起多个 subagent 实施。
3. Review：调用 /request-review，指定检视报告输出位置为 /docs/features/yymmdd-{feature}/{feature}.review.md。若检视发现阻塞问题和合理的建议，则回到 2 进行修改，直到所有必解和建议问题得到解决。
4. Documentation: 将本次需求背景、计划、实施中的重点与值得后续注意的部分简要记录到 /docs/features/yymmdd-{feature}/{feature}.summary.md。更新项目 AGENTS.md 的 ## 模块地图 部分，用于帮助后来的 AGENT 快速入门（仅极简概况）。若本次修改涉及到开发调测流程和规范的更新，也记录到项目 AGENTS.md 相应部分。
5. Commit：最后，在征得用户确认后提交代码修改。