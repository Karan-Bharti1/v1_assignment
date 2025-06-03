import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { createProjectAPI } from '../../utils/api';

type ProjectFormInputs = {
  name: string;
  description?: string;
  startDate?: string; // yyyy-mm-dd
  endDate?: string;   // yyyy-mm-dd
  requiredSkills: string[];
  teamSize?: number;
  status: 'planning' | 'active' | 'completed';
};

const allSkills = [
  'React',
  'Node.js',
  'GraphQL',
  'Java',
  'Spring',
  'SQL',
  'TypeScript',
  'Python',
  'Docker',
  'AWS'
];

export default function ProjectForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProjectFormInputs>({
    defaultValues: {
      status: 'planning',
      requiredSkills: []
    }
  });

  const onSubmit = async (data: ProjectFormInputs) => {
    try {
      await createProjectAPI(data);
      alert('Project created');
      reset();
    } catch (err: any) {
      alert(err.message || 'Failed to create project');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded bg-white shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="name">
            Project Name
          </label>
          <input
            id="name"
            {...register('name', { required: 'Name is required' })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1" htmlFor="startDate">
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
            <label className="block font-medium mb-1" htmlFor="endDate">
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
        <div>
          <label className="block font-medium mb-1">Required Skills</label>
          <Controller
            control={control}
            name="requiredSkills"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <label
                    key={skill}
                    className="inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={skill}
                      checked={field.value.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, skill]);
                        } else {
                          field.onChange(field.value.filter((s) => s !== skill));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="teamSize">
            Team Size
          </label>
          <input
            id="teamSize"
            {...register('teamSize', {
              valueAsNumber: true,
              min: { value: 0, message: 'Must be >= 0' }
            })}
            type="number"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.teamSize && (
            <p className="text-red-600 text-sm mt-1">{errors.teamSize.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            {...register('status', { required: true })}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
          type="submit"
        >
          {isSubmitting ? 'Saving...' : 'Save Project'}
        </button>
      </form>
    </div>
  );
}
