---
id: component
title: Component Example
sidebar_position: 4
---

# React Component Anatomy

This example demonstrates the Ripe Method component structure. Components are "dumb" - they only read state and dispatch actions.

**Structure:**
1. Setup - hooks, selectors, helpers
2. Early returns - loading/empty states
3. Return JSX - as early as possible
4. Helper functions - below the return

**Source:** The Ripe Method, Slide 22

```tsx
/**
 * Example: React Component Anatomy
 * 
 * This example demonstrates the Ripe Method component structure.
 * Components are "dumb" - they only read state and dispatch actions.
 * 
 * Structure:
 * 1. Setup - hooks, selectors, helpers
 * 2. Early returns - loading/empty states
 * 3. Return JSX - as early as possible
 * 4. Helper functions - below the return
 * 
 * Source: The Ripe Method, Slide 22
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Outlet } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  ShopWrapper,
  Header,
  Title,
  QueueTools,
  InfoLabel,
  InfoValue,
  ShopAddress,
  DoorName,
} from "./Shop.styled";
import { HistoryButton, AddCustomerButton } from "../components/Buttons";
import { LanguageSwitch } from "../components/LanguageSwitch";
import { ServiceQueue } from "../components/ServiceQueue";

/**
 * Shop Component
 * 
 * A functional component following Ripe Method patterns:
 * - All state from global store (no useState for app data)
 * - Dispatches actions for user interactions
 * - Helper functions defined after return statement
 */
export function Shop() {
  // ========================================
  // SETUP
  // Initialize variables used in this component
  // Most importantly: state-connected variables and helper functions
  // ========================================
  
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Select specific pieces of state
  const shopId = useAppSelector((state) => state.shop.id);
  const {
    address: shopAddress,
    city: shopCity,
  } = useAppSelector((state) => state.shop);
  const queueLength = useAppSelector((state) => state.service.queue.length);

  // ========================================
  // EARLY RETURNS
  // Main conditions: whether to show the component or an empty variant
  // ========================================
  
  if (!shopId) {
    return null;
  }

  // ========================================
  // RETURN
  // Component JSX as soon as possible
  // This is the most important indicator of the component's function
  // ========================================
  
  return (
    <ShopWrapper>
      <Header>
        <Title>{t("welcome")}</Title>
        <LanguageSwitch />
      </Header>

      <QueueTools>
        {getShopAddress()}
        {getCurrentRequestAmount()}
        
        {/* Simple onClick handlers can be inline */}
        <HistoryButton onClick={() => navigate(`/shop/${shopId}/history`)}>
          {t("history")}
        </HistoryButton>
        
        <AddCustomerButton onClick={() => navigate(`/shop/${shopId}/add`)}>
          {t("add-customer")}
        </AddCustomerButton>
      </QueueTools>

      <ServiceQueue />
      <Outlet />
    </ShopWrapper>
  );

  // ========================================
  // HELPER FUNCTIONS
  // Defined below the return statement
  // They share closures with setup variables
  // Keeps the return statement short and readable
  // ========================================

  /**
   * Renders the current queue count
   * Helper functions appear beneath the return statement
   * and are able to share all of the closures defined in "setup"
   */
  function getCurrentRequestAmount() {
    return (
      <InfoLabel>
        {t("in-queue")}
        {" "}
        <InfoValue>
          {queueLength}
          {t("customers")}
        </InfoValue>
      </InfoLabel>
    );
  }

  /**
   * Renders the shop address if available
   */
  function getShopAddress() {
    if (!shopAddress) {
      return null;
    }
    return (
      <ShopAddress>
        {shopAddress}
        &nbsp;|&nbsp;
        {shopCity}
        &nbsp;|&nbsp;
        <DoorName>{shopId}</DoorName>
      </ShopAddress>
    );
  }
}
```

## Key Principles

1. **NO LOCAL STATE** for app data
   - All data comes from `useAppSelector`
   - No `useState([])`, no local data management

2. **DISPATCH ONLY**
   - Component doesn't call APIs
   - Component doesn't do business logic
   - It only dispatches actions (via navigate or dispatch)

3. **SEMANTIC COMPONENTS**
   - `<QueueTools>`, `<ServiceQueue>`, not `<Div1>`, `<Container>`
   - Component names signify their logical meaning

4. **HELPER FUNCTIONS BELOW RETURN**
   - Keeps the JSX clean and readable
   - Functions share closure with setup variables

5. **EARLY RETURNS FOR EDGE CASES**
   - Handle null/loading states before main render
   - Keeps the happy path clean
