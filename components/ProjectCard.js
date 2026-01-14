// ProjectCard.js
'use client';
import { FolderKanban } from 'lucide-react';
import { employees, PROJECT_STATUS, PRIORITY_LEVELS } from '@/utils/constants';

const ProjectCard = ({ project, onEdit, onStatusChange, isAdmin }) => {
  const getAssignedEmployees = () => {
    return project.assignedTo.map(empId => {
      const emp = employees.find(e => e.id === empId);
      return emp ? emp.name : empId;
    }).join(', ');
  };

  return (
    <div className={`bg-gray-800/50 border ${project.priority.border} rounded-xl p-4 backdrop-blur-sm hover:bg-gray-800/70 transition-colors`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-white flex items-center">
            <FolderKanban className="w-4 h-4 mr-2 text-blue-400" />
            {project.name}
          </h4>
          <p className="text-sm text-gray-400 mt-1">{project.description}</p>
        </div>
        <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${project.priority.bg} ${project.priority.color}`}>
          {project.priority.label}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Status</span>
          <div className="flex items-center space-x-2">
            {isAdmin && (
              <select
                value={project.status}
                onChange={(e) => onStatusChange(project.id, e.target.value)}
                className="text-xs bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
              >
                {Object.values(PROJECT_STATUS).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            )}
            <span className={`text-xs font-semibold ${
              project.status === PROJECT_STATUS.COMPLETED ? 'text-emerald-400' :
              project.status === PROJECT_STATUS.IN_PROGRESS ? 'text-blue-400' :
              project.status === PROJECT_STATUS.ON_HOLD ? 'text-amber-400' :
              'text-gray-400'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Progress</span>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  project.progress < 50 ? 'bg-red-500' :
                  project.progress < 80 ? 'bg-amber-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-white">{project.progress}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Deadline</span>
          <span className="text-xs text-white">{project.deadline}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Assigned To</span>
          <span className="text-xs text-gray-300 truncate ml-2 max-w-[120px]">
            {getAssignedEmployees()}
          </span>
        </div>
      </div>

      {isAdmin && (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(project)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1.5 rounded-lg transition-colors"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;