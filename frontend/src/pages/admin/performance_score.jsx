import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Card, Grid, TextField, Button,
  Avatar, Chip, Divider, IconButton, Paper, LinearProgress } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Refresh from '@mui/icons-material/Refresh';

import { Search as SearchIcon , EmojiEvents , Work, Group , CheckCircle , TrendingUp , Equalizer , Person , ArrowForward, Close, Star,
  BarChart, AssignmentTurnedIn, PeopleAlt, Schedule } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { TrendingDown } from "lucide-react";

// Color palette
const colors = { primary: '#3f51b5', secondary: '#f50057', success: '#4caf50', warning: '#ff9800', error: '#f44336',
  info: '#2196f3', dark: '#212121', light: '#f5f5f5' };

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  border: '1px solid rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
  }
}));

const ScoreBadge = styled(Box)(({ score }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 12px',
  borderRadius: '12px',
  backgroundColor: 
    score >= 85 ? `${colors.success}15` : 
    score >= 70 ? `${colors.info}15` : 
    score >= 55 ? `${colors.warning}15` : `${colors.error}15`,
  color: 
    score >= 85 ? colors.success : 
    score >= 70 ? colors.info : 
    score >= 55 ? colors.warning : colors.error,
  fontWeight: '600',
  fontSize: '0.8rem'
}));

const MetricIcon = styled(Box)(({ theme, color }) => ({
  width: 40,
  height: 40,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: `${color}15`,
  color: color,
  marginRight: theme.spacing(1.5)
}));

const PerformanceDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://skillscale-sqip.onrender.com/api/performance/dashboard');
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'Failed to load performance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredEmployees(
      employees.filter(emp => 
        emp.name.toLowerCase().includes(term) || 
        emp.department.toLowerCase().includes(term) ||
        (emp.position && emp.position.toLowerCase().includes(term)))
    );
  };

  const getPerformanceFeedback = (score) => {
    if (score >= 90) {
      return {
        text: "Outstanding performer",
        color: colors.success,
        icon: <Star fontSize="small" />
      };
    } else if (score >= 80) {
      return {
        text: "Very strong performance",
        color: colors.teal,
        icon: <TrendingUp fontSize="small" />
      };
    } else if (score >= 70) {
      return {
        text: "Strong performance",
        color: colors.info,
        icon: <TrendingUp fontSize="small" />
      };
    } else if (score >= 60) {
      return {
        text: "Meets expectations",
        color: colors.warning,
        icon: <Equalizer fontSize="small" />
      };
    } else if (score >= 50) {
      return {
        text: "Below expectations",
        color: colors.orange,
        icon: <TrendingDown fontSize="small" />
      };
    } else {
      return {
        text: "Needs significant improvement",
        color: colors.error,
        icon: <TrendingDown size={18} />
      };
    }
    
  };

  const getDepartmentColor = (department) => {
    const departmentColors = {
      'Engineering': colors.info,
      'Product': colors.secondary,
      'Design': colors.warning,
      'Marketing': colors.error,
      'Analytics': colors.primary,
      'Human Resources': colors.success
    };
    return departmentColors[department] || colors.dark;
  };

  if (loading) {
    return (
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}>
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} sx={{ color: colors.primary, mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading performance data...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        textAlign: 'center'
      }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading data
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={fetchPerformanceData}
          startIcon={<Refresh />}
          sx={{ 
            bgcolor: colors.primary,
            '&:hover': { bgcolor: `${colors.primary}90` }
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      maxWidth: '1600px', 
      margin: '0 auto',
      backgroundColor: colors.light,
      minHeight: '100vh'
    }}>
        <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" fontWeight="600" color="text.primary" gutterBottom>
            Performance Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage employee performance metrics
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          '& .MuiTextField-root': { 
            backgroundColor: 'background.paper',
            borderRadius: '12px'
          }
        }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search employees..."
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              sx: { 
                borderRadius: '12px',
                '& input': { py: 1 }
              }
            }}
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: 280 }}
          />
         
        </Box>
      </Box>

      {filteredEmployees.length === 0 ? (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: 'background.paper',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <Typography variant="h6" color="text.secondary">
            No employees found matching your search
          </Typography>
          <Button 
            onClick={() => setSearchTerm('')} 
            sx={{ mt: 2 }}
            startIcon={<Refresh />}
          >
            Clear search
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredEmployees.map((employee) => {
            const feedback = getPerformanceFeedback(employee.performanceScore);
            const deptColor = getDepartmentColor(employee.department);
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={employee._id}>
                <StyledCard onClick={() => setSelectedEmployee(employee)}>
                  <Box sx={{ p: 2.5 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      mb: 2 
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 48,
                            height: 48,
                            bgcolor: `${deptColor}20`,
                            color: deptColor,
                            fontWeight: '600'
                          }}
                        >
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="600">{employee.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.position}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={employee.department} 
                        size="small" 
                        sx={{ 
                          backgroundColor: `${deptColor}15`,
                          color: deptColor,
                          fontWeight: '500'
                        }}
                      />
                    </Box>

                    <Divider sx={{ my: 2, borderColor: 'divider' }} />

                    <Grid container spacing={2} sx={{ mb: 1 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MetricIcon color={colors.success}>
                            <AssignmentTurnedIn fontSize="small" />
                          </MetricIcon>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Goals
                            </Typography>
                            <Typography fontWeight="600">
                              {employee.goalScore}/40
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MetricIcon color={colors.primary}>
                            <Person fontSize="small" />
                          </MetricIcon>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Manager
                            </Typography>
                            <Typography fontWeight="600">
                              {employee.managerReviewScore}/20
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MetricIcon color={colors.secondary}>
                            <PeopleAlt fontSize="small" />
                          </MetricIcon>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Peers
                            </Typography>
                            <Typography fontWeight="600">
                              {employee.peerReviewScore}/20
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MetricIcon color={colors.warning}>
                            <Schedule fontSize="small" />
                          </MetricIcon>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Attendance
                            </Typography>
                            <Typography fontWeight="600">
                              {employee.attendanceScore}/20
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, mb: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={employee.performanceScore} 
                        sx={{ 
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: feedback.color,
                            borderRadius: 3
                          }
                        }} 
                      />
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {feedback.icon}
                        <Typography variant="body2" color="text.secondary">
                          {feedback.text}
                        </Typography>
                      </Box>
                      <ScoreBadge score={employee.performanceScore}>
                        {employee.performanceScore}%
                      </ScoreBadge>
                    </Box>
                  </Box>
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Employee Detail Drawer */}
      {selectedEmployee && (
        <Paper elevation={3} sx={{ 
          position: 'fixed', 
          top: 0, 
          right: 0, 
          height: '100vh',
          width: { xs: '100%', sm: '450px', md: '500px' },
          bgcolor: 'background.paper',
          zIndex: 1300,
          overflowY: 'auto',
          borderLeft: `1px solid rgba(0,0,0,0.1)`
        }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3 
            }}>
              <Typography variant="h5" fontWeight="600">
                Performance Details
              </Typography>
              <IconButton 
                onClick={() => setSelectedEmployee(null)}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
                }}
              >
                <Close />
              </IconButton>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3, 
              mb: 4,
              p: 2,
              backgroundColor: 'rgba(0,0,0,0.02)',
              borderRadius: '12px'
            }}>
              <Avatar sx={{ 
                width: 72, 
                height: 72,
                bgcolor: `${getDepartmentColor(selectedEmployee.department)}20`,
                color: getDepartmentColor(selectedEmployee.department),
                fontSize: '1.75rem',
                fontWeight: '600'
              }}>
                {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="600">{selectedEmployee.name}</Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {selectedEmployee.position}
                </Typography>
                <Chip 
                  label={selectedEmployee.department} 
                  size="small" 
                  sx={{ 
                    backgroundColor: `${getDepartmentColor(selectedEmployee.department)}15`,
                    color: getDepartmentColor(selectedEmployee.department),
                    fontWeight: '500'
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                Performance Overview
              </Typography>
              <Box sx={{ 
                p: 3, 
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: '12px',
                mb: 2
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 1
                }}>
                  <Typography variant="body1" fontWeight="500">
                    Overall Score
                  </Typography>
                  <ScoreBadge score={selectedEmployee.performanceScore}>
                    {selectedEmployee.performanceScore}%
                  </ScoreBadge>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={selectedEmployee.performanceScore} 
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getPerformanceFeedback(selectedEmployee.performanceScore).color,
                      borderRadius: 4
                    }
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {getPerformanceFeedback(selectedEmployee.performanceScore).text}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card sx={{ 
                    p: 2, 
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MetricIcon color={colors.success}>
                        <AssignmentTurnedIn fontSize="small" />
                      </MetricIcon>
                      <Typography variant="body2" color="text.secondary">
                        Goal Achievement
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="600">
                      {selectedEmployee.goalScore}
                      <Typography component="span" color="text.secondary">
                        /30
                      </Typography>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(selectedEmployee.goalScore/30)*100} 
                      sx={{ 
                        height: 4,
                        mt: 1,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: colors.success,
                          borderRadius: 2
                        }
                      }} 
                    />
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ 
                    p: 2, 
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MetricIcon color={colors.primary}>
                        <Person fontSize="small" />
                      </MetricIcon>
                      <Typography variant="body2" color="text.secondary">
                        Manager Review
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="600">
                      {selectedEmployee.managerReviewScore}
                      <Typography component="span" color="text.secondary">
                        /20
                      </Typography>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(selectedEmployee.managerReviewScore/20)*100} 
                      sx={{ 
                        height: 4,
                        mt: 1,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: colors.primary,
                          borderRadius: 2
                        }
                      }} 
                    />
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ 
                    p: 2, 
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MetricIcon color={colors.secondary}>
                        <PeopleAlt fontSize="small" />
                      </MetricIcon>
                      <Typography variant="body2" color="text.secondary">
                        Peer Review
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="600">
                      {selectedEmployee.peerReviewScore}
                      <Typography component="span" color="text.secondary">
                        /20
                      </Typography>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(selectedEmployee.peerReviewScore/20)*100} 
                      sx={{ 
                        height: 4,
                        mt: 1,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: colors.secondary,
                          borderRadius: 2
                        }
                      }} 
                    />
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ 
                    p: 2, 
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MetricIcon color={colors.warning}>
                        <Schedule fontSize="small" />
                      </MetricIcon>
                      <Typography variant="body2" color="text.secondary">
                        Attendance
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="600">
                      {selectedEmployee.attendanceScore}
                      <Typography component="span" color="text.secondary">
                        /20
                      </Typography>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(selectedEmployee.attendanceScore/20)*100} 
                      sx={{ 
                        height: 4,
                        mt: 1,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: colors.warning,
                          borderRadius: 2
                        }
                      }} 
                    />
                  </Card>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                Performance Insights
              </Typography>
              <Card sx={{ 
                p: 3, 
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                backgroundColor: 'rgba(0,0,0,0.02)'
              }}>
                {selectedEmployee.performanceScore >= 85 ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ 
                        width: '32px', 
                        height: '32px', 
                        bgcolor: `${colors.success}15`, 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        flexShrink: 0
                      }}>
                        <Star fontSize="small" sx={{ color: colors.success }} />
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="500" sx={{ mb: 0.5 }}>
                          Top Performer
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This employee consistently exceeds expectations in all performance areas.
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ 
                        width: '32px', 
                        height: '32px', 
                        bgcolor: `${colors.success}15`, 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        flexShrink: 0
                      }}>
                        <TrendingUp fontSize="small" sx={{ color: colors.success }} />
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="500" sx={{ mb: 0.5 }}>
                          Growth Potential
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Consider for leadership development programs.
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Box sx={{ 
                        width: '32px', 
                        height: '32px', 
                        bgcolor: `${colors.success}15`, 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        flexShrink: 0
                      }}>
                        <EmojiEvents fontSize="small" sx={{ color: colors.success }} />
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight="500" sx={{ mb: 0.5 }}>
                          Recognition
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Eligible for quarterly excellence award.
                        </Typography>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Performance insights will appear here based on the employee's score.
                  </Typography>
                )}
              </Card>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                Recommended Actions
              </Typography>
              <Card sx={{ 
                p: 3, 
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                backgroundColor: 'rgba(0,0,0,0.02)'
              }}>
                {selectedEmployee.performanceScore >= 85 ? (
                  <>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 2,
                      p: 2,
                      backgroundColor: 'rgba(56, 142, 60, 0.05)',
                      borderRadius: '8px'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ color: colors.success, mr: 1.5 }} />
                        <Typography variant="body1">
                          Promotion consideration
                        </Typography>
                      </Box>
                      <Button 
                        size="small" 
                        endIcon={<ArrowForward />}
                        sx={{ color: colors.success }}
                      >
                        Review
                      </Button>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 2,
                      p: 2,
                      backgroundColor: 'rgba(56, 142, 60, 0.05)',
                      borderRadius: '8px'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PeopleAlt sx={{ color: colors.success, mr: 1.5 }} />
                        <Typography variant="body1">
                          Mentorship program
                        </Typography>
                      </Box>
                      <Button 
                        size="small" 
                        endIcon={<ArrowForward />}
                        sx={{ color: colors.success }}
                      >
                        Assign
                      </Button>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 2,
                      backgroundColor: 'rgba(56, 142, 60, 0.05)',
                      borderRadius: '8px'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmojiEvents sx={{ color: colors.success, mr: 1.5 }} />
                        <Typography variant="body1">
                          Recognition award
                        </Typography>
                      </Box>
                      <Button 
                        size="small" 
                        endIcon={<ArrowForward />}
                        sx={{ color: colors.success }}
                      >
                        Nominate
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Action recommendations will appear here based on the employee's performance.
                  </Typography>
                )}
              </Card>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default PerformanceDashboard;