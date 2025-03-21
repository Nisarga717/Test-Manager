import React, { useState } from 'react';
import hero from '../assets/hero.png';
import workflow from '../assets/workflow.png';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    
    IconButton,
    Switch,
    useTheme,
    Paper
} from '@mui/material';
import { 

    LayoutDashboard, 
    ClipboardList, 
    Layers, 
    ChevronRight, 
    Github 
  } from 'lucide-react';
const HomePage = () => {
    const [darkMode, setDarkMode] = useState(true);
    const theme = useTheme();

    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary'
        }}>
            
            {/* Hero Section */}
            <Box
                sx={{
                    pt: 12,
                    pb: 6,
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        component="h1"
                        variant="h2"
                        color="text.primary"
                        gutterBottom
                        fontWeight="bold"
                    >
                        Streamline Your Testing Process
                    </Typography>
                    <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                        A comprehensive testing platform for your development workflow.
                        Manage test cases, organize test suites, and visualize results with ease.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 8 }}>
                        <Button variant="contained" size="large" color="primary">
                            Try For Free
                        </Button>
                        <Button variant="outlined" size="large">
                            View Demo
                        </Button>
                    </Box>

                    {/* Dashboard Preview */}
                    <Paper
                        elevation={8}
                        sx={{
                            p: 1,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                            maxWidth: '900px',
                            mx: 'auto'
                        }}
                    >
                        <Box
                            sx={{
                                height: '400px',
                                width: '100%',
                                backgroundImage: `url(${hero})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 1
                            }}
                        />
                    </Paper>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 8 }}>
                <Container>
                    <Typography variant="h3" textAlign="center" gutterBottom fontWeight="medium">
                        Key Features
                    </Typography>
                    <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 8 }}>
                        Everything you need to manage your testing workflow efficiently
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Feature 1 */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, bgcolor: 'background.paper' }}>
                                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                                <LayoutDashboard size={48} color={theme.palette.primary.main} />
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2" align="center" fontWeight="bold">
                                        Dashboard Visualization
                                    </Typography>
                                    <Typography align="center" color="text.secondary">
                                        Get insights at a glance with comprehensive dashboards. Track test case status, failure rates, and completion metrics with beautiful visualizations.
                                    </Typography>
                                </CardContent>
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        endIcon={<ChevronRight size={16} />}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Learn more
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>

                        {/* Feature 2 */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, bgcolor: 'background.paper' }}>
                                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                                <ClipboardList size={48} color={theme.palette.primary.main} />
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2" align="center" fontWeight="bold">
                                        Test Case Management
                                    </Typography>
                                    <Typography align="center" color="text.secondary">
                                        Create, organize, and track test cases effortlessly. Assign priorities, owners, and track execution status in a user-friendly interface.
                                    </Typography>
                                </CardContent>
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        endIcon={<ChevronRight size={16} />}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Learn more
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>

                        {/* Feature 3 */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, bgcolor: 'background.paper' }}>
                                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                                    <Layers size={48} color={theme.palette.primary.main} />
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2" align="center" fontWeight="bold">
                                        Test Suite Organization
                                    </Typography>
                                    <Typography align="center" color="text.secondary">
                                        Organize related test cases into logical test suites. Manage authentication, payment, user management, and other functional areas separately.
                                    </Typography>
                                </CardContent>
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        endIcon={<ChevronRight size={16} />}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Learn more
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Workflow Section */}
            <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
                <Container>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" gutterBottom fontWeight="medium">
                                Streamlined Testing Workflow
                            </Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                TestFlow integrates seamlessly into your development process, making testing more efficient and effective.
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                {["Create test suites for different functional areas",
                                    "Define test cases with clear descriptions and expected results",
                                    "Assign tests to team members and track progress",
                                    "Visualize test results with intuitive dashboards"
                                ].map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Box
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2
                                            }}
                                        >
                                            <Typography variant="body2" color="white">{index + 1}</Typography>
                                        </Box>
                                        <Typography variant="body1">{item}</Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3 }}
                            >
                                Get Started Today
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '400px',
                                        width: '100%',
                                        backgroundImage: `url(${workflow})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: 1
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    py: 6,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                TestFlow
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Streamline your testing process with our comprehensive test management platform.
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                <IconButton size="small">
                                    <Github size={20} />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Product
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Features</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Pricing</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Roadmap</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Updates</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Resources
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Documentation</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Tutorials</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Blog</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Community</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Company
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>About</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Careers</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Contact</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Legal
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Privacy</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Terms</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>Security</Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            © {new Date().getFullYear()} TestFlow. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;