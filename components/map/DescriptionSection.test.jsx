// components/map/DescriptionSection.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import DescriptionSection from "./DescriptionSection";

describe("DescriptionSection", () => {
  it("renders the full description on desktop", () => {
    render(<DescriptionSection expanded={false} setExpanded={() => {}} />);

    // The desktop version should have the full text visible
    const desktopElement = screen.getByText(
      /building trust and improving communication between community members/i
    );
    expect(desktopElement).toBeInTheDocument();
  });

  it('toggles expanded state on mobile when "read more" is clicked', () => {
    const mockSetExpanded = jest.fn();
    render(
      <DescriptionSection expanded={false} setExpanded={mockSetExpanded} />
    );

    // Find and click the read more button
    const readMoreButton = screen.getByText(/read more/i);
    fireEvent.click(readMoreButton);

    // Verify that setExpanded was called with the opposite of current expanded state
    expect(mockSetExpanded).toHaveBeenCalledWith(true);
  });
});
