---
id: reducer
title: Reducer Example
sidebar_position: 1
---

# Simple Reducers

This example demonstrates the Ripe Method reducer patterns using Redux Toolkit. Reducers should be "dumb" - only simple assignment and removal, no logic.

**Source:** The Ripe Method, Slide 8

```typescript
/**
 * Example: Simple Reducers
 * 
 * This example demonstrates the Ripe Method reducer patterns using Redux Toolkit.
 * Reducers should be "dumb" - only simple assignment and removal, no logic.
 * 
 * Source: The Ripe Method, Slide 8
 */

import { createReducer } from "@reduxjs/toolkit";
import {
  getServiceQueue,
  getServiceQueueSuccess,
  getServiceQueueFailure,
  setCurrentServiceRequest,
  statusComplete,
  resetServiceRequests,
} from "./request.actions";

// Loading state enum for consistent status tracking
export enum LoadingStates {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

// State interface - always define the shape explicitly
export interface RequestState {
  items: string[];
  byId: Record<string, ServiceRequest>;
  timelinesById: Record<string, Timeline>;
  current: string | null;
  loading: LoadingStates;
}

// Always start with a default (initial) state
export const defaultState: RequestState = {
  items: [],
  byId: {},
  timelinesById: {},
  current: null,
  loading: LoadingStates.IDLE,
};

// The reducer - note how each case is simple assignment only
export const reducer = createReducer<RequestState>(defaultState, (builder) => {
  builder
    // Reset to initial state
    .addCase(resetServiceRequests, (state) => {
      state = { ...defaultState };
    })

    // Simple status change - no logic, just assignment
    .addCase(getServiceQueue, (state) => {
      state.loading = LoadingStates.LOADING;
    })

    // Success case - payload is already formatted for the state
    .addCase(getServiceQueueSuccess, (state, action) => {
      state.loading = LoadingStates.SUCCESS;
      state.queue = action.payload.queue;
      state.byId = action.payload.byId;

      // Data maintenance: remove stale data
      // Note: even this cleanup is simple - just filtering/deletion
      const existingIds = new Set(state.queue);
      state.timelinesById = Object.fromEntries(
        Object.entries(state.timelinesById).filter(([id]) => existingIds.has(id))
      );
    })

    // Error handling - simple status update
    .addCase(getServiceQueueFailure, (state) => {
      state.loading = LoadingStates.ERROR;
    })

    // Classic reducer - simple assignment
    .addCase(setCurrentServiceRequest, (state, action) => {
      state.current = action.payload.id;
    })

    // Data removal - clean up all related structures
    .addCase(statusComplete, (state, action) => {
      state.queue = state.queue.filter((id) => id !== action.payload.id);
      delete state.byId[action.payload.id];
      delete state.timelinesById[action.payload.id];
    });
});

// Types used in this example
interface ServiceRequest {
  id: string;
  customerId: string;
  status: string;
  createdAt: string;
}

interface Timeline {
  id: string;
  events: Array<{ timestamp: string; action: string }>;
}
```

## Key Points

- **Simple assignments only** - No complex logic in reducers
- **Default state** - Always start with a clear initial state
- **Type safety** - Explicit interfaces for state shape
- **Data maintenance** - Clean up related structures when removing items
