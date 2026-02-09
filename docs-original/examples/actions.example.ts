/**
 * Example: Actions & Action Types
 * 
 * This example demonstrates the Ripe Method action patterns using Redux Toolkit.
 * Actions are the vocabulary of your application - they describe what can happen.
 * 
 * Naming convention: verbFeatureVariant
 * - showTests, hideTests (simple toggle)
 * - setLanguage (setting a value)
 * - fetchItemsSuccess, fetchItemsFailure (async results)
 * 
 * Source: The Ripe Method, Slide 13
 */

import { createAction } from "@reduxjs/toolkit";
import type {
  SetLanguagePayload,
  SetAddCustomerCategoryNamePayload,
  SetAddCustomerCommentPayload,
  SetAddCustomerUserNamePayload,
} from "./types";

// ============================================
// Simple actions (no payload)
// ============================================

// UI toggles - declarative & expressive
export const showTests = createAction("ui/showTests");
export const showSuggestions = createAction("ui/showSuggestions");
export const hideTests = createAction("ui/hideTests");
export const hideSuggestions = createAction("ui/hideSuggestions");
export const resetTimeline = createAction("ui/resetTimeline");

// Modal controls
export const showAddCustomer = createAction("ui/showAddCustomer");
export const hideAddCustomer = createAction("ui/hideAddCustomer");
export const resetAddCustomer = createAction("ui/resetAddCustomer");

// ============================================
// Actions with payload
// ============================================

// Language setting - payload is typed
export const setLanguage = createAction<SetLanguagePayload>("ui/setLanguage");

// Form field setters - each has its own action
export const setAddCustomerCategoryName = createAction<SetAddCustomerCategoryNamePayload>(
  "ui/setAddCustomerCategoryName"
);
export const setAddCustomerComment = createAction<SetAddCustomerCommentPayload>(
  "ui/setAddCustomerComment"
);
export const setAddCustomerUserName = createAction<SetAddCustomerUserNamePayload>(
  "ui/setAddCustomerUserName"
);

// ============================================
// Async action patterns
// ============================================

// Trigger action (starts the process)
export const fetchItems = createAction("items/fetch");

// Success action (process completed successfully)
export const fetchItemsSuccess = createAction<FetchItemsSuccessPayload>("items/fetchSuccess");

// Failure action (process failed)
export const fetchItemsFailure = createAction<FetchItemsFailurePayload>("items/fetchFailure");

// ============================================
// Payload Interfaces
// ============================================

// Payload interfaces follow the action name + "Payload"
// They should be pre-formatted to match the state structure

export interface SetLanguagePayload {
  language: Language;
}

export interface SetAddCustomerCategoryNamePayload {
  categoryName: keyof typeof ServiceCategories | "";
}

export interface SetAddCustomerCommentPayload {
  comment: string;
}

export interface SetAddCustomerUserNamePayload {
  userName: string;
}

export interface FetchItemsSuccessPayload {
  items: string[];
  byId: Record<string, Item>;
}

export interface FetchItemsFailurePayload {
  error: string;
  code?: number;
}

// ============================================
// Supporting types
// ============================================

type Language = "en" | "he" | "ar";

const ServiceCategories = {
  general: "General",
  support: "Support",
  sales: "Sales",
} as const;

interface Item {
  id: string;
  name: string;
  price: number;
}
