package com.proseed.support;

import org.junit.jupiter.api.extension.AfterAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;

import java.util.ArrayList;
import java.util.List;

public class TestSummaryExtension implements TestWatcher, AfterAllCallback {

    private final String suiteName;
    private final List<String> successes = new ArrayList<>();
    private final List<String> failures = new ArrayList<>();

    public static TestSummaryExtension forSuite(String suiteName) {
        return new TestSummaryExtension(suiteName);
    }

    private TestSummaryExtension(String suiteName) {
        this.suiteName = suiteName;
    }

    @Override
    public void testSuccessful(ExtensionContext context) {
        String displayName = context.getDisplayName();
        successes.add(displayName);
        System.out.printf("[%s] ✅ PASS - %s%n", suiteName, displayName);
    }

    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        String displayName = context.getDisplayName();
        String reason = cause != null ? cause.getMessage() : "(no message)";
        failures.add(displayName + " -> " + reason);
        System.out.printf("[%s] ❌ FAIL - %s%n    Reason: %s%n", suiteName, displayName, reason);
    }

    @Override
    public void afterAll(ExtensionContext context) {
        System.out.printf("[%s] ===== TEST SUMMARY =====%n", suiteName);
        System.out.printf("[%s] Total: %d | Passed: %d | Failed: %d%n",
            suiteName, successes.size() + failures.size(), successes.size(), failures.size());
        if (!successes.isEmpty()) {
            System.out.printf("[%s] Passed tests:%n", suiteName);
            successes.forEach(name -> System.out.printf("[%s]   ✅ %s%n", suiteName, name));
        }
        if (!failures.isEmpty()) {
            System.out.printf("[%s] Failed tests:%n", suiteName);
            failures.forEach(detail -> System.out.printf("[%s]   ❌ %s%n", suiteName, detail));
        }
        System.out.printf("[%s] ========================%n", suiteName);
    }
}
