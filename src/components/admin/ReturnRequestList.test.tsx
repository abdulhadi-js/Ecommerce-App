import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ReturnRequestList } from "./ReturnRequestList";
import { updateReturnStatus } from "@/actions/admin-returns";

// Mock the server action
vi.mock("@/actions/admin-returns", () => ({
  updateReturnStatus: vi.fn(),
}));

const mockRequests = [
  {
    id: "req_1",
    orderId: "ord_12345",
    reason: "Damaged item",
    quantity: 1,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    order: {
      id: "ord_12345",
      user: { email: "test@example.com", name: "John Doe" },
    },
    product: {
      name: "Test Product",
      images: ["/test.jpg"],
      price: 50,
    },
  },
] as any[];

describe("ReturnRequestList", () => {
  it("renders return requests correctly", () => {
    render(<ReturnRequestList initialRequests={mockRequests} />);
    expect(screen.getByText("Test Product")).toBeDefined();
    expect(screen.getByText('"Damaged item"')).toBeDefined();
    expect(screen.getByText("PENDING")).toBeDefined();
  });

  it("handles approval correctly", async () => {
    (updateReturnStatus as any).mockResolvedValue({ success: true });
    render(<ReturnRequestList initialRequests={mockRequests} />);

    const approveBtn = screen.getByText("Approve");
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(updateReturnStatus).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it("handles rejection correctly", async () => {
    (updateReturnStatus as any).mockResolvedValue({ success: true });
    render(<ReturnRequestList initialRequests={mockRequests} />);

    const rejectBtn = screen.getByText("Reject");
    fireEvent.click(rejectBtn);

    await waitFor(() => {
      expect(updateReturnStatus).toHaveBeenCalledWith(expect.any(FormData));
    });
  });
});