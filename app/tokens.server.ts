import { createMagicToken } from './.server/models/token.model';
import { getUserById } from './.server/models/user.model';
import { sendEmail } from './emails.server';

export const sendMagicToken = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const token = await createMagicToken(userId, 3); // 3 minutes expiration

  const emailContent = `
    <h1>Hello from Noteworthy,</h1>
    <h3>Here is your 🔮 magic token 🔮: <strong>${token.id}</strong></h3>
    <h3>This token will expire in 3 minutes. Needless to say, don't share it.</h3>
  `;

  return await sendEmail(user.email, 'Your Magic Token - Noteworthy', emailContent);
};