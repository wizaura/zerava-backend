import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({ log: ['error'] });

async function main() {
    console.log('🌱 Seeding database...');

    /* ---------------- ADMIN ---------------- */

    const adminEmail = 'admin@zerava.co';

    await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
        },
    });

    console.log('✅ Admin created');

    /* ---------------- OPERATORS ---------------- */

    const operators = await Promise.all([
        prisma.operator.upsert({
            where: { name: 'Melbin Mathew' },
            update: {},
            create: { name: 'Melbin Mathew' },
        }),
        prisma.operator.upsert({
            where: { name: 'Razik M' },
            update: {},
            create: { name: 'Razik M' },
        }),
    ]);

    console.log('✅ Operators created');

    /* ---------------- SERVICE ZONES ---------------- */

    const zones = [
        // Monday
        { postcodePrefix: 'SO18', serviceDay: 1, zoneCode: 'A' },
        { postcodePrefix: 'SO19', serviceDay: 1, zoneCode: 'A' },

        // Tuesday
        { postcodePrefix: 'SO14', serviceDay: 2, zoneCode: 'B' },
        { postcodePrefix: 'SO15', serviceDay: 2, zoneCode: 'B' },

        // Wednesday
        { postcodePrefix: 'SO16', serviceDay: 3, zoneCode: 'C' },
        { postcodePrefix: 'SO17', serviceDay: 3, zoneCode: 'C' },

        // Thursday
        { postcodePrefix: 'SO30', serviceDay: 4, zoneCode: 'D' },
        { postcodePrefix: 'SO31', serviceDay: 4, zoneCode: 'D' },

        // Friday
        { postcodePrefix: 'SO32', serviceDay: 5, zoneCode: 'E' },
        { postcodePrefix: 'SO50', serviceDay: 5, zoneCode: 'E' },

        // Saturday
        { postcodePrefix: 'SO51', serviceDay: 6, zoneCode: 'F' },
        { postcodePrefix: 'SO52', serviceDay: 6, zoneCode: 'F' },
        { postcodePrefix: 'SO53', serviceDay: 6, zoneCode: 'F' },
    ];

    for (const zone of zones) {
        await prisma.serviceZone.upsert({
            where: {
                postcodePrefix_serviceDay: {
                    postcodePrefix: zone.postcodePrefix,
                    serviceDay: zone.serviceDay,
                },
            },
            update: {},
            create: zone,
        });
    }

    console.log('✅ Service zones seeded');

    /* ---------------- SERVICE SLOTS ---------------- */

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        for (const operator of operators) {
            await prisma.serviceSlot.create({
                data: {
                    operatorId: operator.id,
                    date,
                    timeFrom: '09:00',
                    timeTo: '17:00',
                    maxBookings: 4,
                    zonePrefix: 'SO16', // optional, remove to make global
                    status: 'ACTIVE',
                },
            });
        }
    }

    console.log('✅ Service slots seeded');

    console.log('🎉 Database seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
