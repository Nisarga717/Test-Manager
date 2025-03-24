import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTestCases } from '../redux/actions/testCaseActions';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  LinearProgress,
  Tooltip,
  Tab,
  Tabs,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Badge
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  PlayArrow as PlayArrowIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Folder as FolderIcon,
  BugReport as BugReportIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const TestCaseDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    statusData: [],
    priorityData: [],
    byTestSuite: [],
    byAssignee: []
  });

  // Get test cases from Redux store
  const testCases = useSelector(state => state.testCases.testCases);
  
  // Extract test suites and users from the enhanced test cases
  const getUniqueTestSuites = () => {
    const uniqueSuites = {};
    testCases.forEach(testCase => {
      if (testCase.testSuiteId && testCase.testSuiteName) {
        uniqueSuites[testCase.testSuiteId] = { 
          id: testCase.testSuiteId, 
          title: testCase.testSuiteName 
        };
      }
    });
    return Object.values(uniqueSuites);
  };

  const getUniqueUsers = () => {
    const uniqueUsers = {};
    testCases.forEach(testCase => {
      if (testCase.assignedUserId && testCase.assignedUserName) {
        uniqueUsers[testCase.assignedUserId] = { 
          id: testCase.assignedUserId, 
          name: testCase.assignedUserName 
        };
      }
    });
    return Object.values(uniqueUsers);
  };

  // Fetch test cases when component mounts
  useEffect(() => {
    dispatch(fetchTestCases());
  }, [dispatch]);

  // Recalculate dashboard data when test cases change
  useEffect(() => {
    if (testCases.length > 0) {
      calculateDashboardData();
    }
  }, [testCases]);

  const calculateDashboardData = () => {
    // Calculate status data for pie chart
    const statusCounts = {
      Passed: 0,
      Failed: 0,
      Pending: 0,
      "In Progress": 0
    };

    testCases.forEach(testCase => {
      if (statusCounts[testCase.executionStatus] !== undefined) {
        statusCounts[testCase.executionStatus]++;
      }
    });

    const statusData = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));

    // Calculate priority data for pie chart
    const priorityCounts = {
      High: 0,
      Medium: 0,
      Low: 0
    };

    testCases.forEach(testCase => {
      if (priorityCounts[testCase.priority] !== undefined) {
        priorityCounts[testCase.priority]++;
      }
    });

    const priorityData = Object.keys(priorityCounts).map(priority => ({
      name: priority,
      value: priorityCounts[priority]
    }));

    // Get unique test suites
    const testSuites = getUniqueTestSuites();

    // Calculate data by test suite for bar chart
    const testSuiteMap = testSuites.reduce((acc, suite) => {
      acc[suite.id] = {
        name: suite.title,
        total: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        inProgress: 0
      };
      return acc;
    }, {});

    testCases.forEach(testCase => {
      if (testCase.testSuiteId && testSuiteMap[testCase.testSuiteId]) {
        testSuiteMap[testCase.testSuiteId].total++;
        
        if (testCase.executionStatus === "Passed") {
          testSuiteMap[testCase.testSuiteId].passed++;
        } else if (testCase.executionStatus === "Failed") {
          testSuiteMap[testCase.testSuiteId].failed++;
        } else if (testCase.executionStatus === "Pending") {
          testSuiteMap[testCase.testSuiteId].pending++;
        } else if (testCase.executionStatus === "In Progress") {
          testSuiteMap[testCase.testSuiteId].inProgress++;
        }
      }
    });

    const byTestSuite = Object.values(testSuiteMap);

    // Get unique users
    const users = getUniqueUsers();

    // Calculate data by assignee
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = {
        name: user.name,
        assigned: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        inProgress: 0
      };
      return acc;
    }, {});

    // Add "Unassigned" category
    userMap["unassigned"] = {
      name: "Unassigned",
      assigned: 0,
      passed: 0,
      failed: 0,
      pending: 0,
      inProgress: 0
    };

    testCases.forEach(testCase => {
      const assigneeId = testCase.assignedUserId || "unassigned";
      
      if (userMap[assigneeId]) {
        userMap[assigneeId].assigned++;
        
        if (testCase.executionStatus === "Passed") {
          userMap[assigneeId].passed++;
        } else if (testCase.executionStatus === "Failed") {
          userMap[assigneeId].failed++;
        } else if (testCase.executionStatus === "Pending") {
          userMap[assigneeId].pending++;
        } else if (testCase.executionStatus === "In Progress") {
          userMap[assigneeId].inProgress++;
        }
      }
    });

    const byAssignee = Object.values(userMap);

    setDashboardData({
      statusData,
      priorityData,
      byTestSuite,
      byAssignee
    });
  };

  const handleRefresh = () => {
    dispatch(fetchTestCases());
    handleMenuClose();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Passed": return theme.palette.mode === "dark" ? "#4caf50" : "#4caf50";
      case "Failed": return theme.palette.mode === "dark" ? "#f44336" : "#f44336";
      case "Pending": return theme.palette.mode === "dark" ? "#ff9800" : "#ff9800";
      case "In Progress": return theme.palette.mode === "dark" ? "#2196f3" : "#2196f3";
      default: return theme.palette.text.secondary;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return theme.palette.mode === "dark" ? "#f44336" : "#f44336";
      case "Medium": return theme.palette.mode === "dark" ? "#ff9800" : "#ff9800";
      case "Low": return theme.palette.mode === "dark" ? "#4caf50" : "#4caf50";
      default: return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Passed": return <CheckCircleIcon sx={{ color: getStatusColor(status) }} />;
      case "Failed": return <CancelIcon sx={{ color: getStatusColor(status) }} />;
      case "Pending": return <PendingIcon sx={{ color: getStatusColor(status) }} />;
      case "In Progress": return <PlayArrowIcon sx={{ color: getStatusColor(status) }} />;
      default: return null;
    }
  };

  const getPriorityIcon = (priority) => {
    return (
      <FlagIcon sx={{ color: getPriorityColor(priority) }} />
    );
  };

  const COLORS_STATUS = ['#4caf50', '#f44336', '#ff9800', '#2196f3'];
  const COLORS_PRIORITY = ['#f44336', '#ff9800', '#4caf50'];

  // Calculate summary stats
  const totalTestCases = testCases.length;
  const passedTestCases = testCases.filter(tc => tc.executionStatus === "Passed").length;
  const failedTestCases = testCases.filter(tc => tc.executionStatus === "Failed").length;
  const pendingTestCases = testCases.filter(tc => tc.executionStatus === "Pending").length;
  const inProgressTestCases = testCases.filter(tc => tc.executionStatus === "In Progress").length;
  
  const passRate = totalTestCases > 0 ? Math.round((passedTestCases / totalTestCases) * 100) : 0;
  const completionRate = totalTestCases > 0 ? Math.round(((passedTestCases + failedTestCases) / totalTestCases) * 100) : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
          <DashboardIcon sx={{ mr: 1.5 }} />
          Test Case Dashboard
        </Typography>
        <IconButton onClick={handleMenuClick} size="large">
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleRefresh}>
            <RefreshIcon sx={{ mr: 1 }} />
            Refresh Data
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Export Dashboard</MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        </Menu>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderLeft: `4px solid ${theme.palette.primary.main}` }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Test Cases</Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>{totalTestCases}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <AssignmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="body2">{getUniqueTestSuites().length} Test Suites</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderLeft: `4px solid ${getStatusColor("Passed")}` }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Pass Rate</Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>{passRate}%</Typography>
              <Box sx={{ mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={passRate} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 5,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getStatusColor("Passed")
                    }
                  }} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CheckCircleIcon sx={{ mr: 1, color: getStatusColor("Passed") }} />
                <Typography variant="body2">{passedTestCases} Passed Tests</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderLeft: `4px solid ${getStatusColor("Failed")}` }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Failure Rate</Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>{totalTestCases > 0 ? Math.round((failedTestCases / totalTestCases) * 100) : 0}%</Typography>
              <Box sx={{ mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={totalTestCases > 0 ? Math.round((failedTestCases / totalTestCases) * 100) : 0} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 5,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getStatusColor("Failed")
                    }
                  }} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CancelIcon sx={{ mr: 1, color: getStatusColor("Failed") }} />
                <Typography variant="body2">{failedTestCases} Failed Tests</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ borderLeft: `4px solid ${theme.palette.info.main}` }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Completion Rate</Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>{completionRate}%</Typography>
              <Box sx={{ mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={completionRate} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 5,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.info.main
                    }
                  }} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                <Typography variant="body2">{pendingTestCases + inProgressTestCases} Remaining</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              height: 380, 
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>Test Case Status</Typography>
            {dashboardData.statusData.length > 0 ? (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_STATUS[index % COLORS_STATUS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">No data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              height: 380, 
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>Test Case Priority</Typography>
            {dashboardData.priorityData.length > 0 ? (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_PRIORITY[index % COLORS_PRIORITY.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">No data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab 
              icon={<FolderIcon />} 
              iconPosition="start" 
              label="By Test Suite" 
              id="tab-0"
              aria-controls="tabpanel-0" 
            />
            <Tab 
              icon={<PersonIcon />} 
              iconPosition="start" 
              label="By Assignee" 
              id="tab-1"
              aria-controls="tabpanel-1" 
            />
            <Tab 
              icon={<AssignmentIcon />} 
              iconPosition="start" 
              label="Recent Test Cases" 
              id="tab-2"
              aria-controls="tabpanel-2" 
            />
          </Tabs>
        </Box>
        
        {/* Test Suites Tab */}
        <Box
          role="tabpanel"
          hidden={currentTab !== 0}
          id="tabpanel-0"
          aria-labelledby="tab-0"
          sx={{ p: 3, display: currentTab === 0 ? 'block' : 'none' }}
        >
          {dashboardData.byTestSuite.length > 0 ? (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.byTestSuite}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="passed" name="Passed" stackId="a" fill={getStatusColor("Passed")} />
                  <Bar dataKey="failed" name="Failed" stackId="a" fill={getStatusColor("Failed")} />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill={getStatusColor("Pending")} />
                  <Bar dataKey="inProgress" name="In Progress" stackId="a" fill={getStatusColor("In Progress")} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
              <Typography variant="body1" color="text.secondary">No test suite data available</Typography>
            </Box>
          )}
        </Box>
        
        {/* By Assignee Tab */}
        <Box
          role="tabpanel"
          hidden={currentTab !== 1}
          id="tabpanel-1"
          aria-labelledby="tab-1"
          sx={{ p: 3, display: currentTab === 1 ? 'block' : 'none' }}
        >
          {dashboardData.byAssignee.length > 0 ? (
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.byAssignee}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="passed" name="Passed" stackId="a" fill={getStatusColor("Passed")} />
                  <Bar dataKey="failed" name="Failed" stackId="a" fill={getStatusColor("Failed")} />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill={getStatusColor("Pending")} />
                  <Bar dataKey="inProgress" name="In Progress" stackId="a" fill={getStatusColor("In Progress")} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
              <Typography variant="body1" color="text.secondary">No assignee data available</Typography>
            </Box>
          )}
        </Box>
        
        {/* Recent Test Cases Tab */}
        <Box
          role="tabpanel"
          hidden={currentTab !== 2}
          id="tabpanel-2"
          aria-labelledby="tab-2"
          sx={{ p: 3, display: currentTab === 2 ? 'block' : 'none' }}
        >
          {testCases.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Test Suite</TableCell>
                    <TableCell align="center">Priority</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell>Assigned To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testCases.slice(0, 5).map((testCase) => (
                    <TableRow key={testCase.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BugReportIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="body2">{testCase.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {testCase.testSuiteName ? (
                          <Chip 
                            size="small" 
                            label={testCase.testSuiteName} 
                            icon={<FolderIcon />}
                            sx={{ 
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)',
                              color: theme.palette.info.main
                            }}
                          />
                        ) : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={testCase.priority}>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {getPriorityIcon(testCase.priority)}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={testCase.executionStatus}>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {getStatusIcon(testCase.executionStatus)}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {testCase.assignedUserName && testCase.assignedUserName !== "Unassigned" ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                mr: 1, 
                                fontSize: '0.75rem',
                                bgcolor: theme.palette.primary.main
                              }}
                            >
                              {testCase.assignedUserName.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{testCase.assignedUserName}</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">Unassigned</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
              <Typography variant="body1" color="text.secondary">No test cases available</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TestCaseDashboard;