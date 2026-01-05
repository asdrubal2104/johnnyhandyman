import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(10),
      service: z.string().optional(),
      message: z.string().min(10),
      recaptchaToken: z.string(),
    }),
    handler: async (input) => {
      // 1. Verify reCAPTCHA
      const secretKey = import.meta.env.RECAPTCHA_SECRET_KEY;
      
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${input.recaptchaToken}`,
        { method: "POST" }
      );
      
      const data = await response.json();

      if (!data.success || data.score < 0.5) {
        throw new Error("reCAPTCHA verification failed. Please try again.");
      }

      // 2. Process form (e.g., send email)
      console.log("Form submitted successfully:", input);

      return {
        success: true,
        message: "Thank you! We've received your message.",
      };
    },
  }),
};
