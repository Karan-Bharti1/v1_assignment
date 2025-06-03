import React, { useEffect, useState } from 'react';
import { fetchEngineers, fetchEngineerCapacity } from '../../utils/api';
import CapacityBar from '../common/CapacityBar';
import SkillTag from '../common/SkillTag';

interface Engineer {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  seniority?: string;
  maxCapacity: number;
  department?: string;
}

interface CapacityInfo {
  availableCapacity: number;
  activeAssignments: any[];
}

export default function TeamOverview() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [capacities, setCapacities] = useState<Record<string, CapacityInfo>>({});
  const [filterSkill, setFilterSkill] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredEngineers, setFilteredEngineers] = useState<Engineer[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEngineers();
        setEngineers(data);
        // Fetch all capacities in parallel
        const capacitiesResults = await Promise.all(
          data.map(async (eng) => {
            const capacityData = await fetchEngineerCapacity(eng._id);
            return [eng._id, capacityData] as [string, CapacityInfo];
          })
        );
        setCapacities(Object.fromEntries(capacitiesResults));
      } catch {
        // ignore errors here
      }
    })();
  }, []);

  useEffect(() => {
    let filtered = engineers;
    if (filterSkill) {
      filtered = filtered.filter((e) =>
        e.skills.some(
          (s) => s.toLowerCase() === filterSkill.toLowerCase()
        )
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (e.department?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }
    setFilteredEngineers(filtered);
  }, [engineers, filterSkill, searchTerm]);

  const uniqueSkills = Array.from(
    new Set(engineers.flatMap((e) => e.skills))
  ).sort();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Team Overview</h1>
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search by name, email or department"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 flex-grow max-w-xs"
        />
        <select
          value={filterSkill}
          onChange={(e) => setFilterSkill(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Filter by skill</option>
          {uniqueSkills.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
        {filterSkill && (
          <button
            onClick={() => setFilterSkill('')}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear Skill Filter
          </button>
        )}
      </div>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Department</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Seniority</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Skills</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-48">Capacity Utilization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredEngineers.map((eng) => {
              const capacityInfo = capacities[eng._id];
              const usedCapacity = eng.maxCapacity - (capacityInfo?.availableCapacity ?? 0);
              const usagePercent = eng.maxCapacity
                ? Math.round((usedCapacity / eng.maxCapacity) * 100)
                : 0;
              return (
                <tr key={eng._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{eng.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{eng.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{eng.department ?? '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{eng.seniority ?? '-'}</td>
                  <td className="px-4 py-2 text-sm">
                    {eng.skills.map((skill) => (
                      <SkillTag key={skill} skill={skill} />
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    <CapacityBar usagePercent={usagePercent} />
                  </td>
                </tr>
              );
            })}
            {filteredEngineers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No engineers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
