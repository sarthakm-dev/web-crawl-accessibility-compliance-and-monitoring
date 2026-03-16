import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { useAuthStore } from "@/store/auth-store";

vi.mock("@/store/auth-store");

describe("ProtectedRoute", () => {
  it("renders outlet when user exists", () => {
    (useAuthStore as any).mockImplementation((selector: any) =>
      selector({
        user: { id: "1", email: "test@test.com" },
      })
    );

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("redirects to login when user is null", () => {
    (useAuthStore as any).mockImplementation((selector: any) =>
      selector({
        user: null,
      })
    );

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});