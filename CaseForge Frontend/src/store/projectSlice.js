import { createSlice } from '@reduxjs/toolkit';

const MOCK_TEAM_MEMBERS = [
  { id: 1, name: 'Belal El Shazly', initial: 'B' },
  { id: 2, name: 'Amr El Dowaik', initial: 'A' },
  { id: 3, name: 'Omar Wahdan', initial: 'O' },
  { id: 4, name: 'Kenz Kamal', initial: 'K' },
  { id: 5, name: 'Yara Ahmed', initial: 'Y' }
];

const INITIAL_PROJECTS = [
  {
    id: 'prj-001',
    name: 'E-Commerce Payment Gateway',
    description: 'Integration of Stripe and PayPal with the core checkout flow.',
    status: 'ACTIVE',
    updatedAt: '2 hours ago',
    requirementsCount: 12,
    testCasesCount: 45,
    owner: { id: 1, name: 'Belal El Shazly', role: 'Owner (QA)' },
    members: [
      { ...MOCK_TEAM_MEMBERS[0], role: 'Owner (QA)' },
      { ...MOCK_TEAM_MEMBERS[1], role: 'QA' },
      { ...MOCK_TEAM_MEMBERS[2], role: 'Expert' }
    ],
    requirements: [
      { id: 'req-001', name: 'Stripe Payment API Specs', type: 'PDF', status: 'Generated', date: '2 hours ago', techniques: ['Boundary Value', 'Equivalence Partitioning'] },
      { id: 'req-002', name: 'PayPal Integration PRD', type: 'Text', status: 'Ready', date: '1 day ago', techniques: ['State Transition'] }
    ]
  },
  {
    id: 'prj-002',
    name: 'User Authentication Service',
    description: 'OAuth 2.0 implementation with multi-factor authentication support.',
    status: 'ON_HOLD',
    updatedAt: '2 days ago',
    requirementsCount: 8,
    testCasesCount: 24,
    owner: { id: 2, name: 'Amr El Dowaik', role: 'Owner (Expert)' },
    members: [
      { ...MOCK_TEAM_MEMBERS[0], role: 'QA' },
      { ...MOCK_TEAM_MEMBERS[3], role: 'Owner (Expert)' }
    ],
    requirements: [
      { id: 'req-003', name: 'OAuth 2.0 Flow', type: 'Text', status: 'Generated', date: '2 days ago', techniques: ['Decision Table'] }
    ]
  },
  {
    id: 'prj-003',
    name: 'Mobile App API v2',
    description: 'Performance optimization and new endpoints for the mobile team.',
    status: 'ACTIVE',
    updatedAt: '5 mins ago',
    requirementsCount: 20,
    testCasesCount: 0,
    owner: { id: 1, name: 'Belal El Shazly', role: 'Owner (QA)' },
    members: [
      { ...MOCK_TEAM_MEMBERS[1], role: 'QA' },
      { ...MOCK_TEAM_MEMBERS[4], role: 'Expert' },
      { ...MOCK_TEAM_MEMBERS[2], role: 'QA' },
      { ...MOCK_TEAM_MEMBERS[3], role: 'Expert' }
    ],
    requirements: []
  }
];

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'SUBMISSION',
    title: 'Requirement Submitted for Review',
    message: 'Belal El Shazly submitted "Stripe Payment API Specs" for Expert Review.',
    time: '10 mins ago',
    read: false,
    projectId: 'prj-001',
    link: '/project/prj-001/review'
  },
  {
    id: 'notif-2',
    type: 'REGENERATE',
    title: 'Test Case Regeneration Requested',
    message: 'Amr El Dowaik requested regeneration for "OAuth 2.0 Flow" using Boundary Value Analysis.',
    time: '2 hours ago',
    read: false,
    projectId: 'prj-002',
    link: '/project/prj-002/regenerate'
  },
  {
    id: 'notif-3',
    type: 'APPROVED',
    title: 'Test Cases Approved',
    message: 'All test cases for "PayPal Integration PRD" have been approved.',
    time: '1 day ago',
    read: true,
    projectId: 'prj-001',
    link: '/project/prj-001/contract/select'
  }
];

const initialState = {
  projects: INITIAL_PROJECTS,
  notifications: MOCK_NOTIFICATIONS,
  currentProjectId: null,
  currentRequirementId: null,
  testCases: [],
  loading: false,
  error: null,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addProject: (state, action) => {
      // action.payload should be the new project object
      state.projects.unshift(action.payload);
    },
    deleteProject: (state, action) => {
  const projectId = action.payload;

  state.projects = state.projects.filter(project => project.id !== projectId);

  state.notifications = state.notifications.filter(
    notification => notification.projectId !== projectId
  );

  if (state.currentProjectId === projectId) {
    state.currentProjectId = null;
  }
},
    updateProjectTeam: (state, action) => {
      // action.payload: { projectId, members }
      const { projectId, members } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        project.members = members;
        project.updatedAt = 'Just now';
      }
    },
    addRequirement: (state, action) => {
      // action.payload: { projectId, requirement }
      const { projectId, requirement } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        if (!project.requirements) project.requirements = [];
        project.requirements.unshift(requirement);
        project.requirementsCount = project.requirements.length;
        project.updatedAt = 'Just now';
      }
    },
    setProject: (state, action) => {
      state.currentProjectId = action.payload;
    },
    openManageTeamModal: (state) => {
      state.isManageTeamModalOpen = true;
    },
    closeManageTeamModal: (state) => {
      state.isManageTeamModalOpen = false;
    },
    setRequirement: (state, action) => {
      state.currentRequirementId = action.payload;
    },
    setTestCases: (state, action) => {
      state.testCases = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    markNotificationAsRead: (state, action) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },

    saveGeneratedTestCases: (state, action) => {
  const { projectId, groupedTestCases } = action.payload;
  const project = state.projects.find(p => p.id === projectId);

  if (project) {
    project.generatedTestCases = groupedTestCases;
    project.testCasesCount = groupedTestCases.reduce(
      (total, group) => total + group.testCases.length,
      0
    );

    project.requirements = project.requirements.map(req => ({
      ...req,
      status: "Generated"
    }));

    project.updatedAt = "Just now";
  }
},

  },
});

export const { 
  addProject, 
  deleteProject,
  updateProjectTeam, 
  addRequirement,
  setProject, 
  openManageTeamModal, 
  closeManageTeamModal, 
  setRequirement, 
  setTestCases, 
  setLoading, 
  setError,
  saveGeneratedTestCases,
  markNotificationAsRead,
  markAllNotificationsAsRead
} = projectSlice.actions;

export default projectSlice.reducer;
