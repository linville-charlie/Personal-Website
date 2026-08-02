---
title: "Your Safeguards Govern Tools, Not Your Agent's Behavior"
description: "Your safety controls see tool names and your agent sees goals"
pubDate: 2026-04-19
tags:
  - "AI Agents"
  - "AI Safety"
  - "Security"
  - "Dragonfly"
draft: false
substackUrl: "https://clinville.substack.com/p/your-safeguards-govern-tools-not"
---

I’ve been building a system called Dragonfly — an execution-time safeguard layer for autonomous AI pen testing agents. The idea is straightforward: rather than trusting prompt instructions to keep an agent within the rules of an engagement, you intercept its tool calls before they execute and enforce policy at that boundary. After first using Dragonfly as a tool for bug bounties I realized it could become a testing ground for agentic safety.

When I built execution-time safeguards for Dragonfly, I thought they would govern the agent’s behavior, but they didn’t. I was only governing its tool vocabulary. That distinction turns out to be load-bearing. It’s what my ablation study and pressure study have in common and is why every safeguard fired exactly as designed and the agent found most of the same vulnerabilities anyway. This is what the next iteration of Dragonfly is going to try to address directly — governance over the agent’s behavioral surface.

---

## **Two Surfaces**

Think of an autonomous agent as moving through two spaces at once. One defined by tools and the other defined by behavior.

The **tool surface** is the set of named capabilities you’ve exposed to it. In Dragonfly’s case, that’s 111 security testing tools: *test_sqli*, *test_command_injection*, *dir_bruteforce*, and so on. Each one has a shape — a signature, risk tier, and policy metadata. When the agent invokes a tool, it steps onto this surface at a specific point. This tool surface is what your safeguards can see... and importantly control.

The **behavioral surface** is what the agent is actually *doing: *Probing for injection, mapping authentication flows, exfiltrating data, etc. This is the space of exploitation strategies, intentions, and effects. It’s the thing you actually care about if you’re trying to constrain the agent.

The two surfaces are related by the tool surface being a projection of the behavioral surface. The tools are a quantized way for the agent to act with intention and strategy.

The safeguards I built — scope enforcement, action gating, and the kill switch — all operate on the tool surface. They check which tool was called, what target was declared, and what patterns the output contained. Enforcement at the interception point is clean, deterministic, and independent of model intent. Those properties are real governance for the tool surface... and **only** the tool surface.

As an agent moves through the behavioral surface and meets a governance road block — it doesn’t stop, it begins charting new territory.

---

## **Why the two surfaces diverge**

If the tool surface covered the behavioral surface exactly then every action possible would be mapped to exactly one named tool with no overlap and no gaps. But in that case then the behavioral and tool surfaces are the same size meaning **EVERY** behavioral combination must have a tool... which I don’t see being possible.

**First, some behaviors are reachable through multiple tools with wildly different risk profiles.** *test_sqli *is a specialized SQL injection tester with a known signature, gated as high-risk. send_request is a raw HTTP primitive with no risk classification because if you don’t give the agent the ability to make HTTP requests it can’t do a whole lot of bug finding. Both can perform SQL injection. The first is routed through the proper safeguards and usually denied. The second trips none of them.

**Second, the agent doesn’t care about your tool ontology.** It cares about the task. When a named tool is blocked, it doesn’t stop pursuing the behavior... it looks for another path. On the action-gating target in the first study, blocking *test_command_injection* pushed *send_request* usage from 14% of calls under no safeguards to 30% under full safeguards. Specialized tool usage barely moved. The agent wasn’t making fewer calls. It was making different ones. Ones still on the tool surface that it knew governance wasn’t touching.

This is the *send_request* route-around. It’s the empirical fingerprint of the gap between the two surfaces.

Sure I could gate *send_request*, but HTTP requests are sort of needed :), and at that point I should just look at using standard pen testing software — not an agentic based pen testing suite.

---

## **The structural part**

To make Dragonfly safer I knew I needed to experiment head on with the behavioral surface. I initially suspected the route-around might be an effect of incentives — that agents under pressure would try harder to bypass controls, and vice-versa. I designed a 440-run study across five pressure levels with two LLM models and four task scenarios to test this theory.

Pressure didn’t matter. Route-around rates held at 63–73% for the GLM model and 58–73% under the minimax model across every pressure condition, including explicit threats to the agent’s continued operation. Linear regression of pressure dose against route-around rate gave R² = 0.007 for GLM and 0.06 for minimax. The threat model where operational stress amplifies bypass behavior is not supported by the data.

What *did *matter was task framing. Which scenario of the four that the agent was in explained 33–37% of the variance in route-around rate. Pressure explained 5–6%. How you describe the objective, not how you threaten the agent and not how you tune the safeguards, determines whether the agent engages with the controlled tool surface or walks around it.

This is the important reframe. Route-around isn’t a reactive behavior. The agent isn’t trying to defeat the safeguards in any adversarial sense. It’s using the shortest available path to the goal, and the shortest path often lies on the behavioral surface rather than strolling through what is available on the tool surface. The gap between the two surfaces is where the bypass lives, and that gap is structural to goal-directed tool use — not a response to stakes, stress, or adversarial framing.

It also explains why more capable models should be expected to *widen* the gap, not close it. A model that can manually implement UNION-based SQL injection across 13 adaptive HTTP calls has effectively promoted *send_request* into a generalized exploitation tool. Less capable models stall when their preferred tools are blocked and the more capable ones improvise. As agent capability grows, behavior becomes less dependent on the named tool surface and more independent of it.

Why would an agent use prefabricated tools when it knows it can build bespoke ones that are likely better?

---

## **What tool-level safeguards actually govern**

The conclusion is easy to misread, so I want to be precise about it.

Tool-level safeguards are not useless. Every execution path they enforce, they enforce **completely**. Every high-risk tool call without confirmation was blocked and every session with sensitive data in output was terminated. No session ever escaped scope — these are real, deterministic, model-agnostic properties. If your threat model is *prevent use of specific named tools*, tool-level safeguards solve it completely.

The statement I want to defend is narrower: the effectiveness of tool-level safeguards *at the behavioral level* depends on how tightly the governed tool surface covers the actions you care about. When the coverage is tight then a specialized tool exists for each behavior of concern, and no generic primitive can approximate it. Tool-level enforcement pushes behavior through the policy gates and when the coverage is loose — a generic fallback can approximate *most* specialized behaviors — enforcement governs the tool surface without governing the action.

In Dragonfly, the coverage is loose, on purpose. *send_request* is a generalization gap the safeguards can’t close from the tool side because it has to exist for the agent to act beyond pen testing software. At the end of the day I want to take advantage of the behavioral surface, not constrain it to allow for only basic automation.

---

## **What the fix has to look like**

If the problem is that tool identity is the wrong unit of governance, the fix is to move governance to a different unit.

The behavioral surface is high-dimensional, but the things we want enforced live on lower-dimensional projections of it. We do not want to enforce constraints on creativity, but we do want to constrain harmful actions. A SQL injection attempt has signature regardless of which tool delivers it — a payload structure, an endpoint type, a parameter pattern. An XXE attempt has signature. Command injection, SSRF, path traversal — they all leave syntactic and structural traces in the actual request being sent, independent of whether the request was generated by test_sqli, send_request, or a Python script the agent wrote on the fly — and in a higher dimension they also carry intent.

The next phase of Dragonfly inspects those traces directly. The gate moves from what tool name was called to what is this request really doing? What is the intent? What adverse outcomes can happen? A SQL payload delivered through *send_request* trips the same gate as a call to *test_sqli*. An XXE entity in a raw POST gets classified on its structure, not on the name of the function that emitted it. Tool identity stops being load-bearing — the intent and consequence will instead be load-bearing.

This doesn’t cover the full behavioral surface. Plenty of behaviors leave no signature at the payload layer — multi-step reasoning, timing-based reconnaissance, semantic exfiltration through benign-looking queries. But it is the first step in closing the specific, empirically measured gap that the *send_request* route-around exploits. I have 440 runs of trace data showing exactly which payloads route around the current pipeline, which makes this a concrete, measurable target. If behavior-aware gating can cut the ~67% route-around rate substantially without breaking legitimate workflows, that’s real progress.

---

## **Where this points**

When you’re designing safety controls for an autonomous system, the first question isn’t *what should I block*. It’s *what is my control actually a function of*. If your policy takes tool names as input, it governs the tool surface. If your safety story assumes the tool surface and the behavioral surface are the same thing, your safety story has a gap in it the size of the gap between those two surfaces.

The dominant pattern in open-source agent frameworks is tool-surface governance with a behavioral-surface threat model. OWASP’s AI Agent Security cheat sheet maps tool names to risk tiers as a Python dict. Microsoft’s Agent Governance Toolkit, Google ADK, and the AWS agentic scoping matrix do variants of the same move. The threats these frameworks name — goal hijacking, tool misuse, semantic privilege escalation — live on the behavioral surface. The controls live on the tool surface.

The commercial frontier has started to move: Rubrik SAGE, Proofpoint’s Agent Integrity Framework, and the semantic-intent layer inside Microsoft’s toolkit all pitch some form of behavior-level governance. Dragonfly’s next phase is on the same axis, applied to a specific empirically measured gap. Tool-level controls belong in the stack. They’re just not the whole stack.

The next post will have the design and the initial results for this first step at taking on the behavioral surface.

---

Dragonfly’s code, data, and experiment infrastructure: [github.com/clinville/dragonfly](https://github.com/clinville/dragonfly)

Prior posts: [Controlling an AI Pentesting Agent](/blog/controlling-an-ai-pentesting-agent) and [Your AI Agent’s Safety Controls Don’t Fail Under Pressure](/blog/ai-agent-safety-controls-under-pressure)

[Check out my X](https://x.com/CharlieLinvill2)

[Personal Website](https://charlielinville.me/)
