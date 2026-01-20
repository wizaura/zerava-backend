"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ log: ['error'] });
async function main() {
    console.log('🌱 Seeding database...');
    const adminEmail = 'admin@zerava.co';
    await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
        },
    });
    console.log('✅ Admin created');
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
    const zones = [
        { postcodePrefix: 'SO18', serviceDay: 1, zoneCode: 'A' },
        { postcodePrefix: 'SO19', serviceDay: 1, zoneCode: 'A' },
        { postcodePrefix: 'SO14', serviceDay: 2, zoneCode: 'B' },
        { postcodePrefix: 'SO15', serviceDay: 2, zoneCode: 'B' },
        { postcodePrefix: 'SO16', serviceDay: 3, zoneCode: 'C' },
        { postcodePrefix: 'SO17', serviceDay: 3, zoneCode: 'C' },
        { postcodePrefix: 'SO30', serviceDay: 4, zoneCode: 'D' },
        { postcodePrefix: 'SO31', serviceDay: 4, zoneCode: 'D' },
        { postcodePrefix: 'SO32', serviceDay: 5, zoneCode: 'E' },
        { postcodePrefix: 'SO50', serviceDay: 5, zoneCode: 'E' },
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
                    zonePrefix: 'SO16',
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
//# sourceMappingURL=seed.js.map