import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendReportEmail, transporter } from "../src/services/email.service";

vi.mock("nodemailer", () => {
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: vi.fn().mockResolvedValue(true),
      })),
    },
  };
});

describe("sendReportEmail", () => {

  const mockEmail = "test@example.com";
  const mockReportId = "123";
  const mockBuffer = Buffer.from("pdf-data");

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("should send email with PDF attachment", async () => {

    const sendMailSpy = vi.spyOn(transporter, "sendMail").mockResolvedValue({} as any);

    await sendReportEmail(mockEmail, mockBuffer, mockReportId);

    expect(sendMailSpy).toHaveBeenCalled();

    const args = sendMailSpy.mock.calls[0][0];

    expect(args.to).toBe(mockEmail);
    expect(args.subject).toBe("Your Accessibility Report is Ready");

    expect(args.attachments![0]).toEqual({
      filename: `report-${mockReportId}.pdf`,
      content: mockBuffer,
      contentType: "application/pdf",
    });

  });

});