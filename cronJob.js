import cron from 'node-cron';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Schedule the task to run every 3 minutes
cron.schedule('*/3 * * * *', async () => {
    try {
        const currentDateTime = new Date(); // Get the current date and time

        await prisma.magicToken.deleteMany({
            where: {
                expiresAt: {
                    lt: currentDateTime, // Use the expiresAt field to find expired tokens
                }
            }
        });
        console.log('Expired tokens deleted successfully');
    } catch (error) {
        console.error('Error deleting expired tokens:', error);
    }
});

console.log('Cron job scheduled to delete expired tokens every 3 minutes');