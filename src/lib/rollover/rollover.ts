import { Item, ItemType } from '@/types/domain';

export function shouldRollover(item: Item): boolean {
  switch (item.type) {
    case 'task':
      return item.status !== 'done';
    case 'material':
      return item.status !== 'delivered';
    case 'issue':
      return item.status !== 'resolved';
    case 'delay':
      return item.status !== 'closed';
    case 'email':
      return item.status !== 'sent';
    default:
      return false;
  }
}

export function rolloverItems(
  items: Item[],
  newDayEntryId: string,
  todayISO: string
): Item[] {
  const toCarry = items.filter(shouldRollover);

  return toCarry.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
    dayEntryId: newDayEntryId,
    rolledFromItemId: item.id,
    createdAt: todayISO,
    updatedAt: todayISO,
    closedAt: undefined,
  }));
}
