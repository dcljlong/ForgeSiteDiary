import { items } from '@/lib/domain/devStore';
import { rolloverItems } from '@/lib/rollover/rollover';
import { nowISO } from '@/lib/domain/dates';
import { Item } from '@/types/domain';

export function seedAndTestRollover() {
  items.length = 0;

  const base: Item[] = [
    {
      id: '1',
      jobId: 'job1',
      dayEntryId: 'day1',
      type: 'task',
      title: 'Install ceiling grid',
      priority: 'high',
      status: 'open',
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
    {
      id: '2',
      jobId: 'job1',
      dayEntryId: 'day1',
      type: 'material',
      title: 'Order plasterboard',
      priority: 'critical',
      status: 'ordered',
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
    {
      id: '3',
      jobId: 'job1',
      dayEntryId: 'day1',
      type: 'task',
      title: 'Completed item',
      priority: 'normal',
      status: 'done',
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
  ];

  items.push(...base);

  const rolled = rolloverItems(items, 'day2', nowISO());

  return {
    originalCount: items.length,
    rolledCount: rolled.length,
    rolled,
  };
}
