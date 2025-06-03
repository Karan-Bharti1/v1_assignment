import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  fetchEngineers,
  fetchProjects,
  fetchEngineerCapacity,
  createAssignmentAPI
} from '../../utils/api';

type AssignmentFormInputs = {
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  role?: string;
  startDate?: string;
  endDate?: string;
};

export default function AssignmentForm() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<AssignmentFormInputs>({
    defaultValues: {
      allocationPercentage: 50
    }
  });

  const [engineers, setEngineers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [engineerCapacity, setEngineerCapacity] = useState<{ availableCapacity: number } | null>(null);

  const selectedEngineerId = watch('engineerId');
  const selectedProjectId = watch('projectId');
  const allocationPercentage = watch('allocationPercentage');

  useEffect(() => {
    (async () => {
      const fetchedEngineers = await fetchEngineers();
      setEngineers(fetchedEngineers);
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
    })();
  }, []);

  useEffect(() => {
    // Validate capacity and skill matching

    async function validate() {
      clearErrors('allocationPercentage');
      if (!selectedEngineerId || !selectedProjectId) return;

      try {
        const capacityData = await fetchEngineerCapacity(selectedEngineerId);
        setEngineerCapacity(capacityData);

        if (allocationPercentage > capacityData.availableCapacity) {
          setError('allocationPercentage', {
            type: 'manual',
            message: `Allocation exceeds available capacity (${capacityData.availableCapacity}%)`
          });
          return;
        }

        const project = projects.find((p) => p._id === selectedProjectId);
        const engineer = engineers.find((e) => e._id === selectedEngineerId);
        if (!project || !engineer) {
          return;
        }
        const requiredSkills: string[] = project.requiredSkills || [];
        const engineerSkills: string[] = engineer.skills || [];
        if (requiredSkills.length > 0) {
          const matched = requiredSkills.some((skill) => engineerSkills.includes(skill));
          if (!matched) {
            setError('engineerId', {
              type: 'manual',
              message: 'Engineer does not have required skills for this project'
            });
          } else {
            clearErrors('engineerId');
          }
        }
      } catch {
        // ignore errors here
      }
    }
    validate();
  }, [allocationPercentage, selectedEngineerId, selectedProjectId, clearErrors, setError, projects, engineers]);

  const onSubmit = async (data: AssignmentFormInputs) => {
    try {
      await createAssignmentAPI(data);
      alert('Assignment created');
    } catch (err: any) {
      alert(err.message || 'Failed to create assignment');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded bg-white shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Assignment</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="engineerId" className="block font-medium mb-1">
            Engineer
          </label>
          <select
            id="engineerId"
            {...register('engineerId', { required: 'Select an engineer' })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select engineer</option>
            {engineers.map((eng) => (
              <option key={eng._id} value={eng._id}>
                {eng.name} ({eng.email})
              </option>
            ))}
          </select>
          {errors.engineerId && <p className="text-red-600 text-sm mt-1">{errors.engineerId.message}</p>}
        </div>

        <div>
          <label htmlFor="projectId" className="block font-medium mb-1">
            Project
          </label>
          <select
            id="projectId"
            {...register('projectId', { required: 'Select a project' })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select project</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name} [{proj.status}]
              </option>
            ))}
          </select>
          {errors.projectId && <p className="text-red-600 text-sm mt-1">{errors.projectId.message}</p>}
        </div>

        <div>
          <label htmlFor="allocationPercentage" className="block font-medium mb-1">
            Allocation Percentage (%)
          </label>
          <input
            id="allocationPercentage"
            type="number"
            min={0}
            max={100}
            {...register('allocationPercentage', {
              required: 'Allocation is required',
              min: { value: 0, message: 'Min 0' },
              max: { value: 100, message: 'Max 100' }
            })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.allocationPercentage && (
            <p className="text-red-600 text-sm mt-1">{errors.allocationPercentage.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block font-medium mb-1">
            Role in Project
          </label>
          <input
            id="role"
            {...register('role')}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Developer, Tech Lead, etc."
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="startDate" className="block font-medium mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              {...register('startDate')}
              type="date"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="endDate" className="block font-medium mb-1">
              End Date
            </label>
            <input
              id="endDate"
              {...register('endDate')}
              type="date"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Assignment'}
        </button>
      </form>
    </div>
  );
}
