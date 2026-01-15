import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
    log: ['error'],
});


async function main() {
    console.log('🌱 Seeding database...');

    const adminEmail = 'admin@zerava.co';
    const adminPassword = await bcrypt.hash('admin123', 10);

    await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
        },
    });

    console.log('✅ Admin user created');

    // --------------------
    // Time slots (next 7 days)
    // --------------------
    const today = new Date();

    for (let day = 1; day <= 5; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);
        date.setHours(0, 0, 0, 0);

        const times = ['09:00', '11:00', '14:00', '16:00'];

        for (const time of times) {
            await prisma.timeSlot.upsert({
                where: {
                    date_time: {
                        date,
                        time,
                    },
                },
                update: {},
                create: {
                    date,
                    time,
                    capacity: 1,
                    isActive: true,
                },
            });
        }
    }


    console.log('✅ Time slots seeded');

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
