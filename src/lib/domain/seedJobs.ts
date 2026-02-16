import { jobs } from '@/lib/domain/devStore';
import { Job } from '@/types/domain';
import { nowISO } from '@/lib/domain/dates';

import { uuid } from '@/lib/domain/uuid';
export function seedJobs() {
  if (jobs.length > 0) return;

  const base: Job[] = [
    {
      id: 'CU-001',
      jobNumber: 'CU-001',
      name: 'Bethlehem Fitout',
      mainContractor: 'MainBuild Ltd',
      siteAddress: 'Tauranga',
      stage: 'in_progress',
      active: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
    {
      id: 'CU-002',
      jobNumber: 'CU-002',
      name: 'Ceiling Replacement',
      mainContractor: 'Commercial Interiors NZ',
      siteAddress: 'Hamilton',
      stage: 'prestart',
      active: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
  ];

  jobs.push(...base);
}
