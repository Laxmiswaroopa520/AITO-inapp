import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MeetCoachDialog } from "./MeetCoachDialog";

// The Coach hooks fail the test if called, so a clean render proves no Coach request is made.
vi.mock("../../hooks", () => {
  const notCalled = (name: string) => () => { throw new Error(`${name} must not be called while Coach booking is disabled`); };
  return { useCoaches: notCalled("useCoaches"), useCoachAvailability: notCalled("useCoachAvailability"), useBookCoach: notCalled("useBookCoach") };
});

describe("MeetCoachDialog", () => {
  it("shows the coming-soon notice without starting the booking flow", () => {
    const html = renderToStaticMarkup(<MeetCoachDialog open huddleExternalId="huddle-1" huddleName="Huddle" onClose={() => undefined} />);
    expect(html).toContain("Coach booking is not available yet.");
    expect(html).toContain("This capability is planned for a future release.");
    expect(html).not.toContain("Choose a Coach");
    expect(html).not.toContain("Loading approved Coaches");
  });

  it("renders nothing while closed", () => {
    expect(renderToStaticMarkup(<MeetCoachDialog open={false} huddleExternalId="huddle-1" huddleName="Huddle" onClose={() => undefined} />)).toBe("");
  });
});
