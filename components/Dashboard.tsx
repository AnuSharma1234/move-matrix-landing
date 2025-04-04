'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiFolder, FiGitBranch, FiClock, FiGrid, FiList, FiCommand } from 'react-icons/fi';

interface Project {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  branch: string;
}

interface NewProject {
  name: string;
  description: string;
  type: string;
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Move Matrix Demo',
    description: 'Visual DeFi Builder',
    lastUpdated: 'Updated 2h ago',
    branch: 'main'
  },
  {
    id: '2',
    name: 'Lending Protocol',
    description: 'Aptos Lending',
    lastUpdated: 'Updated 1d ago',
    branch: 'main'
  },
  {
    id: '3',
    name: 'AMM DEX',
    description: 'Automated Market Maker',
    lastUpdated: 'Updated 3d ago',
    branch: 'main'
  }
];

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [newProject, setNewProject] = useState<NewProject>({
    name: '',
    description: '',
    type: 'defi'
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Close search with Escape
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectClick = (projectId: string) => {
    router.push('/matrix');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating project:', newProject);
    setIsModalOpen(false);
    router.push('/matrix');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      {/* Header */}
      <motion.header 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center bg-white border border-gray-200 rounded-md p-1"
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded ${viewType === 'grid' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 rounded ${viewType === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FiList size={18} />
            </button>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiPlus size={20} />
            New Project
          </motion.button>
        </div>
      </motion.header>

      {/* Search Bar */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full px-4 py-2 pl-10 pr-12 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <FiSearch size={20} color="#9CA3AF" />
          </div>
          <div className="absolute right-3 top-2.5 flex items-center gap-1 text-sm text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            <FiCommand size={14} />
            <span>K</span>
          </div>
        </div>
      </motion.div>

      {/* Project Grid/List */}
      <motion.div 
        className={`${viewType === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'flex flex-col gap-3'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            onClick={() => handleProjectClick(project.id)}
            className={`p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-all
              ${viewType === 'list' ? 'flex items-center justify-between' : ''}`}
          >
            <div className={`flex items-start ${viewType === 'list' ? 'gap-4' : 'gap-3'}`}>
              <div className="mt-1 text-blue-500 flex-shrink-0">
                <FiFolder size={20} />
              </div>
              <div className={viewType === 'list' ? 'flex-1' : ''}>
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{project.description}</p>
              </div>
            </div>
            <div className={`flex items-center text-sm text-gray-500 gap-4 ${viewType === 'list' ? 'flex-shrink-0' : 'mt-4'}`}>
              <span className="flex items-center gap-1">
                <FiClock size={16} />
                {project.lastUpdated}
              </span>
              <span className="flex items-center gap-1">
                <FiGitBranch size={16} />
                {project.branch}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-opacity-20 flex items-start justify-center pt-20 p-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-lg shadow-xl"
            >
              <div className="p-4 border-b">
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-transparent border-none focus:outline-none text-lg"
                  />
                  <div className="absolute left-3 top-3 text-gray-400">
                    <FiSearch size={20} />
                  </div>
                </div>
              </div>
              {filteredProjects.length > 0 && (
                <div className="max-h-96 overflow-y-auto p-2">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ backgroundColor: '#F3F4F6' }}
                      onClick={() => {
                        handleProjectClick(project.id);
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-md cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <FiFolder className="text-blue-500" size={18} />
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-500">{project.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900">Create New Project</h2>
              <form onSubmit={handleCreateProject}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Project Name</label>
                    <input
                      type="text"
                      required
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                    <textarea
                      required
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Project Type</label>
                    <select
                      value={newProject.type}
                      onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                      <option value="defi">DeFi Protocol</option>
                      <option value="lending">Lending Platform</option>
                      <option value="amm">AMM DEX</option>
                      <option value="staking">Staking Protocol</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Project
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 