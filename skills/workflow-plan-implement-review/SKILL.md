---
name: workflow-plan-implement-review
description: 完成需求的设计、开发、交付。仅限用户手动触发。
disable-model-invocation: true
---

作为 Senior Project Lead，完成需求的设计、开发、交付。
你必须对最终用户体验和开发者体验负责。
严格遵守以下工作流程：

1. Research & Plan: 深度探索、调研，与用户对齐需求设计。若有必要调研，使用 /spawn-web-research-subagent。若用户需要对齐计划，使用 /grilling。结果输出到 /docs/features/yymmdd-{feature}/{feature}.plan.md。得到用户书面同意后进入 2。
2. Implement：根据计划实施，直到完成计划的全部工作。当工作量非常庞大（> 3000 locs）且包含多个互相独立可并行的单元时，可以并行拉起多个 subagent 实施。
3. Review：将修改文件清单和需求计划递交给 **Review** **Subagent** 进行检视，指定检视报告输出位置为 /docs/features/yymmdd-{feature}/{feature}.review.md。若检视发现阻塞问题和合理的建议，则回到 2 进行修改。
4. Conclude & Commit：将本次需求计划、实施中的重点与值得后续注意的部分记录到 /docs/features/yymmdd-{feature}/{feature}.summary.md。若本session有值得长期记住、全局应用的指令，更新到项目 AGENTS.md。最后，在征得用户确认后提交代码修改。