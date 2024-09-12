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
		<p>Hello from Noteworthy,</p>
		<p>Here is your magic token: ${token.id}</p>
		<p>This token will expire in 3 minutes.</p>
	`;

  return await sendEmail(user.email, 'Your Magic Token', emailContent);
};