---
id: 00-introduction
title: Introduction
sidebar_position: 1
---

# The Ripe Method

**Onboarding to the New Front-end Software Architecture**

---

## What is the Ripe Method?

The Ripe Method is MCE's approach to building front-end applications. It's a set of principles and patterns that guide how we structure code, manage state, and build user interfaces.

The name "Ripe" reflects our goal: code that is mature, ready for production, and easy to maintain. Like ripe fruit, our applications should be complete, consistent, and satisfying to work with.

## Why a New Architecture?

As our applications grow, so does complexity. Without shared conventions, every developer solves problems differently. This leads to:

- **Inconsistent code** — Hard to read, harder to maintain
- **Hidden dependencies** — Changes break unexpected things
- **Scattered logic** — Business rules spread across components
- **Difficult onboarding** — New developers struggle to understand the codebase

The Ripe Method addresses these problems by establishing clear boundaries, predictable patterns, and a shared vocabulary for our entire team.

## The Four Commandments

At the heart of the Ripe Method are four core principles:

| # | Commandment | What It Means |
|---|-------------|---------------|
| I | **One Global State** | All application data lives in a single, centralized store |
| II | **Unidirectional Flow** | Data flows in one direction: actions → state → view |
| III | **Fixed File Structure** | Every project follows the same folder organization |
| IV | **Three Functional Layers** | Clear separation between Store, Business Logic, and View |

These aren't arbitrary rules. Each one solves a specific problem we've encountered in production applications.

## What You'll Learn

This onboarding guide will walk you through:

1. **The Elements** — The 16 principles that shape our architecture
2. **Global State** — How to think about and structure application state
3. **Information Flow** — How data moves through the application
4. **App Structure** — Where every piece of code belongs
5. **Functional Layers** — The three layers and their responsibilities

By the end, you'll understand not just *what* we do, but *why* we do it.

## A Note on Tooling

We use **Redux Toolkit (RTK)** for state management. The patterns in this guide assume familiarity with:

- Redux concepts (store, actions, reducers)
- React functional components
- TypeScript

If you're new to these, take some time to review their documentation first. The Ripe Method builds on these foundations.

---

**Ready?** Let's start with [the elements of the architecture](/client-architecture/01-elements).
