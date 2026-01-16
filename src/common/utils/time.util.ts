export function generateTimeBlocks(
    timeFrom: string,
    timeTo: string,
    blockMinutes: number
): { from: string, to: string }[] {
    const blocks: { from: string, to: string }[] = [];

    let current = toMinutes(timeFrom);
    const end = toMinutes(timeTo);

    while (current + blockMinutes <= end) {
        blocks.push({
            from: toTime(current),
            to: toTime(current + blockMinutes),
        });
        current += blockMinutes;
    }

    return blocks;
}

function toMinutes(t: string) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

function toTime(mins: number) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
