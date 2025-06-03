import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { fetchProfileAPI, updateEngineerAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

type ProfileFormInputs = {
  skills: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  department?: string;
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

export default function Profile() {
  const { user, logout } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormInputs>({ defaultValues: { skills: [] } });

  useEffect(() => {
    if (!user) return;
    fetchProfileAPI()
      .then((data) => {
        reset({
          skills: data.skills || [],
          seniority: data.seniority,
          department: data.department
        });
      })
      .catch(() => {
        logout();
      });
  }, [user, reset, logout]);

  const onSubmit = async (data: ProfileFormInputs) => {
    try {
      await updateEngineerAPI(user!.id, data);
      alert('Profile updated');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded bg-white shadow">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Skills</label>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill) => {
              const isChecked = watch('skills').includes(skill);
              return (
                <label
                  key={skill}
                  className="inline-flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={skill}
                    checked={isChecked}
                    onChange={(e) => {
                      const newSkills = watch('skills');
                      if (e.target.checked) {
                        clearErrors('skills');
                        reset({ ...watch(), skills: [...newSkills, skill] }, { keepValues: true });
                      } else {
                        reset({ ...watch(), skills: newSkills.filter((s) => s !== skill) }, { keepValues: true });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{skill}</span>
                </label>
              );
            })}
          </div>
          {errors.skills && (
            <p className="text-red-600 text-sm mt-1">{errors.skills.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="seniority">
            Seniority Level
          </label>
          <select
            id="seniority"
            {...register('seniority')}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select seniority</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="department">
            Department
          </label>
          <input
            id="department"
            {...register('department')}
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Your department"
          />
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
          type="submit"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
