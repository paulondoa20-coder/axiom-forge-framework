import { test, expect } from "@playwright/test";

/**
 * Messaging behaviour without an authenticated user, and after sign-in.
 * Credentials come from E2E_EMAIL / E2E_PASSWORD (never hardcode secrets).
 */

test.describe("messagerie sans compte", () => {
  test("affiche le bandeau démo et pas d'erreur Unauthorized", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });

    await page.goto("/messages", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Conversations" })).toBeVisible();
    await expect(page.getByText(/Mode démo/i)).toBeVisible();

    expect(errors.join("\n")).not.toContain("Unauthorized");
  });

  test("le bandeau mène à la page de connexion", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: "Se connecter" }).first().click();
    await expect(page).toHaveURL(/\/auth/);
    await expect(page.getByRole("button", { name: /Se connecter/ })).toBeVisible();
  });
});

test.describe("messagerie connectée", () => {
  test.skip(
    !process.env['E2E_EMAIL'] || !process.env['E2E_PASSWORD'],
    "E2E_EMAIL / E2E_PASSWORD requis",
  );

  test("après connexion, le bandeau démo disparaît", async ({ page }) => {
    await page.goto("/auth?redirect=%2Fmessages", { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("toi@exemple.com").fill(process.env['E2E_EMAIL']!);
    await page.getByPlaceholder("••••••••").fill(process.env['E2E_PASSWORD']!);
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page).toHaveURL(/\/messages/, { timeout: 20_000 });
    await expect(page.getByText(/Mode démo/i)).toHaveCount(0);
  });
});
