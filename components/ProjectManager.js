// /components/ProjectManager.js
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/utils/constants';

export default function ProjectManager({
  projects,
  myProjects,
  showMyProjects,
  setShowMyProjects,
  setShowProjectModal,
  setCurrentProject
}) {
  const { user } = useAuth();
  const isManager = user?.role === ROLES.MANAGER;

  if (!isManager && myProjects.length === 0) {
    return null; // Hide component for agents with no projects
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">
            {isManager ? 'Project Management' : 'My Projects'}
          </h2>
          <p className="text-sm text-gray-400">
            {isManager ? 'Manage all projects' : 'View your assigned projects'}
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => {
              setCurrentProject({
                id: '',
                name: '',
                description: '',
                status: 'Not Started',
                priority: 'Medium',
                assignedTo: [],
                deadline: '',
                progress: 0
              });
              setShowProjectModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
          >
            + New Project
          </button>
        )}
      </div>

      {/* Only show toggle for managers */}
      {isManager && (
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setShowMyProjects(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !showMyProjects
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setShowMyProjects(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              showMyProjects
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            My Projects ({myProjects.length})
          </button>
        </div>
      )}

      {/* Project List */}
      <div className="space-y-4">
        {(showMyProjects ? myProjects : projects).map((project) => (
          <div key={project.id} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{project.description}</p>
              </div>
              
              {/* Different actions based on role */}
              {isManager ? (
                <button
                  onClick={() => {
                    setCurrentProject(project);
                    setShowProjectModal(true);
                  }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                >
                  Edit
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'Completed' ? 'bg-green-900/30 text-green-400' :
                    project.status === 'In Progress' ? 'bg-blue-900/30 text-blue-400' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {project.status}
                  </span>
                  <button
                    onClick={() => {
                      // Agent can only update status
                      const newStatus = prompt('Update status:', project.status);
                      if (newStatus) {
                        // Update project status
                      }
                    }}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}