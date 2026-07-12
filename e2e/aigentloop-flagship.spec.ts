import { test, expect, type Page, type Request } from '@playwright/test';

/**
 * Real-path E2E for the AIgentLoop flagship redesign (D-009): the passive,
 * self-playing signal-flow line (A) + synced detail/log panel (C).
 *
 * Per playbook §9 these run un-mocked against the real dev app on :3000 — the
 * flagship has NO backend, so "real path" means the actual shipped component with
 * its real timers and IntersectionObserver, not a mocked engine. We assert the
 * pipeline drives itself end-to-end (idea → 6 agents → gate → revise → diff-ready)
 * and — critically (AC-4.8) — that it makes ZERO network/AI calls while doing so.
 *
 * Scoping notes:
 *  - The flagship loops continuously, so `scrollIntoViewIfNeeded` (which waits for a
 *    stable box) never settles. We scroll with a non-blocking `evaluate` instead, then
 *    let the IntersectionObserver arm the passive run.
 *  - The synced detail text is mirrored into an `aria-live` (`sr-only`) region and,
 *    for a couple of captions, into the SignalFlow mobile markers. We scope stage-text
 *    assertions to the `region[aria-label="Current pipeline stage"]` landmark so we
 *    match the one visible panel copy, not the live-region echo.
 */

/** The flagship homepage section shell. */
function section(page: Page) {
  return page.locator('#aigentloop');
}

/** The synced detail/log panel (excludes the sr-only live region + flow captions). */
function detailPanel(page: Page) {
  return page.getByRole('region', { name: 'Current pipeline stage' });
}

/** Bring an element into view without waiting for animation to go stable. */
async function scrollTo(page: Page, selector: string) {
  await page.locator(selector).waitFor({ state: 'attached' });
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), selector);
}

/** Record every non-asset request the page issues after this is installed. */
function trackRequests(page: Page): Request[] {
  const seen: Request[] = [];
  page.on('request', (req) => {
    const type = req.resourceType();
    if (type === 'document' || type === 'stylesheet' || type === 'script' || type === 'font' || type === 'image')
      return;
    seen.push(req);
  });
  return seen;
}

test.describe('AIgentLoop flagship — passive signal-flow (homepage embed)', () => {
  test('renders the signal-flow line with one node per agent (valid, unique)', async ({ page }) => {
    await page.goto('/');
    await scrollTo(page, '#aigentloop');
    const sec = section(page);

    // The whole flow is labelled for assistive tech.
    await expect(sec.getByRole('img', { name: 'Pipeline flow' })).toBeVisible();

    // Exactly six stage nodes, one per agent — no duplicated desktop+mobile set.
    await expect(sec.getByRole('group')).toHaveCount(6);

    // Each deep-link anchor is unique in the DOM.
    for (const id of ['requirements', 'design', 'architecture', 'implementer', 'tester', 'handoff']) {
      await expect(page.locator(`#step-${id}`)).toHaveCount(1);
    }
    await expect(page.locator('#gate-1')).toHaveCount(1);
  });

  test('plays itself to the "diff ready" frame with ZERO network/AI calls (AC-4.6/4.8)', async ({ page }) => {
    await page.goto('/');
    const calls = trackRequests(page);
    await scrollTo(page, '#aigentloop');

    // It auto-runs on scroll and, after the human gate auto-approves and the tester
    // revise beat, resolves at the reviewable diff. Generous timeout covers a full
    // cinematic pass at the (deliberately unhurried, D-012) section cadence — ~34s.
    await expect(detailPanel(page).getByText('Diff ready for human commit')).toBeVisible({ timeout: 55_000 });

    // The scenario IS the script — nothing hit the network.
    expect(calls, `unexpected network calls: ${calls.map((c) => c.url()).join(', ')}`).toHaveLength(0);
  });

  test('surfaces the human approval gate as a distinct, labelled beat (AC-4.3)', async ({ page }) => {
    await page.goto('/');
    await scrollTo(page, '#aigentloop');
    // The gate prompt shows in the synced detail panel during the paused beat.
    await expect(detailPanel(page).getByText(/Awaiting your approval: requirements/i)).toBeVisible({ timeout: 40_000 });
    await expect(detailPanel(page).getByText('Human gate')).toBeVisible({ timeout: 10_000 });
  });

  test('shows the tester→implementer self-correction beat (AC-4.5)', async ({ page }) => {
    await page.goto('/');
    await scrollTo(page, '#aigentloop');
    await expect(detailPanel(page).getByText(/contrast bug on the temp card/i)).toBeVisible({ timeout: 40_000 });
  });

  test('offers light passive controls: Pause and Replay (self-playing, not click-first)', async ({ page }) => {
    await page.goto('/');
    await scrollTo(page, '#aigentloop');
    const sec = section(page);
    // There is NO "Run" button in passive mode — it plays on its own.
    await expect(sec.getByRole('button', { name: 'Run the AIgentLoop pipeline' })).toHaveCount(0);
    await expect(sec.getByRole('button', { name: 'Replay the pipeline from the start' })).toBeVisible();
    await expect(sec.getByRole('button', { name: /the pipeline animation/i })).toBeVisible();
  });
});

test.describe('AIgentLoop flagship — /aigentloop deep-dive page', () => {
  test('routes to the dedicated page and plays the same pipeline', async ({ page }) => {
    await page.goto('/aigentloop');
    // The page mount uses variant="page" but the same self-playing engine.
    await expect(page.getByRole('img', { name: 'Pipeline flow' })).toBeVisible();
    // On a narrow viewport the pipeline sits below the fold — scroll it in so the
    // IntersectionObserver arms the passive run (it plays only while on screen).
    await scrollTo(page, '[aria-label="Current pipeline stage"]');
    await expect(detailPanel(page).getByText('Diff ready for human commit')).toBeVisible({ timeout: 55_000 });
  });

  test('deep-links to a stage anchor', async ({ page }) => {
    await page.goto('/aigentloop#step-tester');
    await expect(page.locator('#step-tester')).toBeVisible();
  });
});

test.describe('AIgentLoop flagship — reduced motion (AC-5.3)', () => {
  test('settles on the resolved diff-ready frame without looping', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/aigentloop');
    // Scroll the pipeline into view so it arms even on a narrow viewport.
    await scrollTo(page, '[aria-label="Current pipeline stage"]');
    // Under reduced motion the traversal is instant and the loop is disabled — it
    // comes to rest on the final legible frame.
    await expect(detailPanel(page).getByText('Diff ready for human commit')).toBeVisible({ timeout: 15_000 });
    await context.close();
  });
});
