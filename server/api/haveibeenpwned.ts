import type { H3Event, EventHandlerRequest } from 'h3';
import pwned from "haveibeenpwned";

export default defineEventHandler(async (event) => {
  // const { email } = await readBody(event);  // Extract email from request body

  const email = "spyrouzoe@gmail.com"

  // if (!email) {
  //   return { error: "Email is required" };
  // }

  try {
    const breaches = await new Promise((resolve, reject) => {
      pwned.breachedAccount(email, (err: Error | null, data: any) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
    return { breaches };
  } catch (error) {
    console.error("An error occurred:", error);
    return { error: "Failed to check for breaches." };
  }
});
function useBody(event: H3Event<EventHandlerRequest>): { email: any; } | PromiseLike<{ email: any; }> {
  throw new Error('Function not implemented.');
}

