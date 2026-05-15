import { userRepository } from "../repositories/user";
import { sessionService } from "./session";

export async function getCurrentUser() {
  const { session } = await sessionService.verifySession();
  return userRepository.getUser({ id: session.id });
}
