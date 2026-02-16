import { items } from '@/lib/domain/devStore';
import { Item } from '@/types/domain';

export type PrioritySummary = {
  critical: number;
  high: number;
  overdue: number;
  ordered: number;
};

export function calculatePrioritySummary(): PrioritySummary {
  const summary: PrioritySummary = {
    critical: 0,
    high: 0,
    overdue: 0,
    ordered: 0,
  };

  const now = new Date();

  items.forEach((item: Item) => {
    if (item.status === 'done') return;

    if (item.priority === 'critical') summary.critical++;
    if (item.priority === 'high') summary.high++;

    if (item.type === 'material' && item.status === 'ordered') {
      summary.ordered++;
    }

    if (item.dueDate) {
      const due = new Date(item.dueDate);
      if (due < now) {
        summary.overdue++;
      }
    }
  });

  return summary;
}
