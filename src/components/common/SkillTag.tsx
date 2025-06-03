import React from 'react';

interface SkillTagProps {
  skill: string;
}

export default function SkillTag({ skill }: SkillTagProps) {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
      {skill}
    </span>
  );
}
