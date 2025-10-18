import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  LinearProgress,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
  Zoom,
  Slide,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar,
  Stack
} from "@mui/material";
import {
  Timer as TimerIcon,
  Person as PersonIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
  ArrowUpward as ArrowUpwardIcon,
  NavigateNext as NavigateNextIcon,
  EmojiEvents as EmojiEventsIcon,
  Score as ScoreIcon,
  Analytics as AnalyticsIcon
} from "@mui/icons-material";

const FieldQuestionsPage = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [userName, setUserName] = useState("");
  const [progress, setProgress] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/admin/questions/fields/que/${fieldId}`);
        if (res.data?.questions) {
          setQuestions(res.data.questions);
          setAnswers(res.data.questions.map(() => ""));
        } else {
          console.error("Questions data is missing");
        }
      } catch (err) {
        console.error("Error fetching questions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [fieldId]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, submitted]);

  const handleAnswerChange = (questionId, answer, questionIndex) => {
    setAnswers((prev) =>
      prev.map((a, i) => (questions[i]._id === questionId ? answer : a))
    );
    
    // Track answered questions for progress
    setAnsweredQuestions(prev => new Set(prev.add(questionIndex)));
  };

  const handleStartQuiz = () => {
    if (!userName.trim()) {
      alert("Please enter your name to start the quiz");
      return;
    }
    setQuizStarted(true);
  };

  const handleAutoSubmit = async () => {
    try {
      const answersData = questions.map((q, i) => ({
        questionId: q._id,
        answer: answers[i],
      }));

      const res = await api.post(`/admin/questions/fields/submit-answer/${fieldId}`, {
        fieldId,
        userName,
        answers: answersData,
      });

      if (res.data.success) {
        setSubmitted(true);
        const progressRes = await api.get(`/admin/questions/fields/progress/${fieldId}`);
        setProgress(progressRes.data.progress);
      }
    } catch (err) {
      console.error("Error auto-submitting answers", err);
      setSubmitted(true);
    }
  };

  const handleSubmit = async () => {
    setShowSubmitConfirm(false);
    await handleAutoSubmit();
  };

  const handleSubmitClick = () => {
    if (answeredCount === 0) return;
    setShowSubmitConfirm(true);
  };

  const cancelSubmit = () => {
    setShowSubmitConfirm(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = answers.filter(answer => answer !== "").length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const getLatestQuestions = (questionsAnswered) => {
    if (!Array.isArray(questionsAnswered)) {
      console.error("Invalid questionsAnswered data", questionsAnswered);
      return [];
    }

    const latestQuestions = {};
    questionsAnswered.forEach((qa) => {
      const questionId = qa.question._id;
      if (!latestQuestions[questionId] || new Date(qa.question.createdAt) > new Date(latestQuestions[questionId].question.createdAt)) {
        latestQuestions[questionId] = qa;
      }
    });

    return Object.values(latestQuestions);
  };

  const scrollToQuestion = (index) => {
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getPerformanceData = (score) => {
    if (score >= 90) return { level: "Excellent", color: theme.palette.success.main, emoji: "🎯", bgColor: theme.palette.success.light };
    if (score >= 80) return { level: "Great", color: theme.palette.info.main, emoji: "🌟", bgColor: theme.palette.info.light };
    if (score >= 70) return { level: "Good", color: theme.palette.primary.main, emoji: "👍", bgColor: theme.palette.primary.light };
    if (score >= 60) return { level: "Average", color: theme.palette.warning.main, emoji: "📚", bgColor: theme.palette.warning.light };
    return { level: "Needs Improvement", color: theme.palette.error.main, emoji: "💪", bgColor: theme.palette.error.light };
  };

  // Loading State
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Zoom in={true}>
          <Box textAlign="center">
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ mb: 3, color: theme.palette.primary.main }}
            />
            <Typography variant="h5" color="textSecondary" gutterBottom>
              Loading Questions
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Preparing your quiz experience...
            </Typography>
          </Box>
        </Zoom>
      </Box>
    );
  }

  // Results State
  if (submitted && progress) {
    const filteredQuestions = getLatestQuestions(progress.questionsAnswered);
    const scorePercentage = Math.floor((progress.totalCorrect / progress.totalAnswered) * 100) || 0;
    const performance = getPerformanceData(scorePercentage);

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true}>
          <Box>
            {/* Success Header */}
            <Box textAlign="center" mb={6}>
              <Zoom in={true}>
                <Box>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'success.main',
                      mx: 'auto',
                      mb: 3,
                      fontSize: '2rem'
                    }}
                  >
                    <CheckCircleIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h3" gutterBottom fontWeight="bold">
                    Quiz Submitted Successfully!
                  </Typography>
                  <Typography variant="h6" color="textSecondary" paragraph>
                    Thank you, <Box component="span" color="primary.main" fontWeight="bold">{userName}</Box>! 
                    Your answers have been recorded.
                  </Typography>
                </Box>
              </Zoom>
            </Box>

            {/* Performance Overview */}
            <Grid container spacing={4} mb={6}>
              <Grid item xs={12} md={6}>
                <Slide in={true} direction="up" timeout={500}>
                  <Card 
                    sx={{ 
                      p: 4, 
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${performance.bgColor} 0%, ${theme.palette.background.paper} 100%)`,
                      border: `2px solid ${performance.color}`
                    }}
                  >
                    <Box position="relative" display="inline-flex" mb={3}>
                      <CircularProgress
                        variant="determinate"
                        value={scorePercentage}
                        size={120}
                        thickness={4}
                        sx={{ color: performance.color }}
                      />
                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography variant="h5" component="div" fontWeight="bold">
                          {scorePercentage}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h4" gutterBottom color={performance.color}>
                      <EmojiEventsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {performance.level}
                    </Typography>
                    <Stack direction="row" spacing={3} justifyContent="center" mt={2}>
                      <Box textAlign="center">
                        <Typography variant="h6" color={performance.color}>
                          {progress.totalCorrect}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Correct
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6" color="error.main">
                          {progress.totalAnswered - progress.totalCorrect}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Incorrect
                        </Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6" color="textSecondary">
                          {progress.totalAnswered}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Total
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Slide>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Slide in={true} direction="up" timeout={700}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h5" gutterBottom>
                      <AnalyticsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Performance Insights
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <ScoreIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Accuracy Rate"
                          secondary={`${scorePercentage}% - ${performance.level}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <TimerIcon color="info" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Completion Time"
                          secondary={`${Math.floor((30 * 60 - timeLeft) / 60)} minutes`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Questions Attempted"
                          secondary={`${answeredCount} out of ${questions.length}`}
                        />
                      </ListItem>
                    </List>
                  </Card>
                </Slide>
              </Grid>
            </Grid>

            {/* Detailed Results */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h4">
                    Detailed Results
                  </Typography>
                  <Box display="flex" gap={2}>
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label={`Correct: ${progress.totalCorrect}`} 
                      color="success" 
                      variant="outlined"
                    />
                    <Chip 
                      icon={<ErrorIcon />} 
                      label={`Incorrect: ${progress.totalAnswered - progress.totalCorrect}`} 
                      color="error" 
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {filteredQuestions?.length > 0 ? (
                    filteredQuestions.map((qa, index) => (
                      <Grid item xs={12} key={qa._id}>
                        <Fade in={true} timeout={(index + 1) * 200}>
                          <Paper 
                            elevation={2}
                            sx={{ 
                              p: 3,
                              borderLeft: `4px solid ${qa.isCorrect ? theme.palette.success.main : theme.palette.error.main}`,
                              backgroundColor: qa.isCorrect ? theme.palette.success.light : theme.palette.error.light,
                              width: 1150,
                            }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                              <Chip 
                                label={`Q${index + 1}`} 
                                color={qa.isCorrect ? "success" : "error"}
                                variant="filled"
                              />
                              <Chip 
                                icon={qa.isCorrect ? <CheckCircleIcon /> : <ErrorIcon />}
                                label={qa.isCorrect ? "Correct" : "Incorrect"}
                                color={qa.isCorrect ? "success" : "error"}
                              />
                            </Box>
                            
                            <Typography variant="h6" gutterBottom>
                              {qa.question.text}
                            </Typography>
                            
                            <Box mt={2}>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                Your Answer:
                              </Typography>
                              <Typography 
                                variant="body1" 
                                color={qa.isCorrect ? "success.main" : "error.main"}
                                sx={{ 
                                  p: 1, 
                                  bgcolor: 'background.paper', 
                                  borderRadius: 1,
                                  border: `1px solid ${qa.isCorrect ? theme.palette.success.main : theme.palette.error.main}`
                                }}
                              >
                                {qa.answer || "No answer provided"}
                              </Typography>
                              
                              {!qa.isCorrect && (
                                <Box mt={2}>
                                  <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Correct Answer:
                                  </Typography>
                                  <Typography 
                                    variant="body1"
                                    color="success.main"
                                    sx={{ 
                                      p: 1, 
                                      bgcolor: theme.palette.success.light, 
                                      borderRadius: 1,
                                      border: `1px solid ${theme.palette.success.main}`
                                    }}
                                  >
                                    {qa.question.options?.[parseInt(qa.question.correctAnswer)]?.text || 'N/A'}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Paper>
                        </Fade>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Alert severity="info">
                        No questions were answered.
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/dashboard")}
                sx={{ minWidth: 200 }}
              >
                Back to Home
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<RefreshIcon />}
                onClick={() => window.location.reload()}
                sx={{ minWidth: 200 }}
              >
                Retake Quiz
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    );
  }

  // Quiz Start State
  if (!quizStarted) {
    return (
      <Box
        minHeight="100vh"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Slide in={true} direction="up">
          <Card 
            sx={{ 
              maxWidth: 600, 
              width: '100%',
              p: { xs: 3, md: 4 },
              mx: 'auto'
            }}
            elevation={8}
          >
            <Box textAlign="center" mb={4}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <PlayArrowIcon fontSize="large" />
              </Avatar>
              <Typography variant="h3" gutterBottom fontWeight="bold">
                Quiz Instructions
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Get ready to test your knowledge!
              </Typography>
            </Box>

            <List sx={{ mb: 4 }}>
              {[
                { icon: <TimerIcon color="primary" />, title: "Time Limit", desc: "30 minutes to complete all questions" },
                { icon: <InfoIcon color="primary" />, title: "Total Questions", desc: `${questions.length} questions to answer` },
                { icon: <WarningIcon color="warning" />, title: "Important", desc: "Timer starts immediately when you begin" },
                { icon: <EmojiEventsIcon color="success" />, title: "Scoring", desc: "Immediate results with detailed feedback" }
              ].map((item, index) => (
                <ListItem key={index} sx={{ py: 2 }}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.desc}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              ))}
            </List>

            <TextField
              fullWidth
              label="Enter Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your full name"
              margin="normal"
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleStartQuiz}
              disabled={!userName.trim()}
              startIcon={<PlayArrowIcon />}
              sx={{ 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              Start Quiz Now
            </Button>
          </Card>
        </Slide>
      </Box>
    );
  }

  // Main Quiz Interface
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Submit Confirmation Dialog */}
      <Dialog
        open={showSubmitConfirm}
        onClose={cancelSubmit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <SendIcon color="primary" />
            Submit Quiz?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to submit your quiz? This action cannot be undone.
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText
                primary="Questions Answered"
                secondary={`${answeredCount} out of ${questions.length}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Time Remaining"
                secondary={formatTime(timeLeft)}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Completion Progress"
                secondary={`${Math.round(progressPercentage)}%`}
              />
            </ListItem>
          </List>
          
          <Alert severity="warning" sx={{ mt: 2 }}>
            Once submitted, you cannot change your answers.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelSubmit}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            startIcon={<CheckCircleIcon />}
          >
            Submit Quiz
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sticky Header */}
      <AppBar 
        position="sticky" 
        elevation={2}
        sx={{ 
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* User Info */}
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <PersonIcon fontSize="small" />
              </Avatar>
              <Typography variant="body1" fontWeight="medium">
                {userName}
              </Typography>
            </Box>

            {/* Timer - Desktop */}
            {!isMobile && (
              <Box display="flex" alignItems="center" gap={1}>
                <TimerIcon color={timeLeft < 300 ? "error" : "primary"} />
                <Typography 
                  variant="body1" 
                  fontWeight="bold"
                  color={timeLeft < 300 ? "error" : "text.primary"}
                >
                  {formatTime(timeLeft)}
                  {timeLeft < 300 && " (Hurry!)"}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Progress */}
          <Box sx={{ minWidth: 200 }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">
                {answeredCount}/{questions.length}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {Math.round(progressPercentage)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage}
              color={progressPercentage === 100 ? "success" : "primary"}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Floating Timer */}
      {isMobile && (
        <Box
          position="fixed"
          top={80}
          right={16}
          zIndex={1000}
        >
          <Slide in={true} direction="left">
            <Paper
              elevation={4}
              sx={{
                p: 1.5,
                backgroundColor: timeLeft < 300 ? 'error.main' : 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 3
              }}
            >
              <TimerIcon fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatTime(timeLeft)}
              </Typography>
              {timeLeft < 300 && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s infinite'
                  }}
                />
              )}
            </Paper>
          </Slide>
        </Box>
      )}

      {/* Questions Container */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Quiz Title Section */}
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold">
              Quiz Questions
            </Typography>
            <Box display="flex" gap={2}>
              {['Total', 'Answered', 'Remaining'].map((stat, index) => (
                <Chip
                  key={stat}
                  label={`${stat}: ${
                    index === 0 ? questions.length : 
                    index === 1 ? answeredCount : 
                    questions.length - answeredCount
                  }`}
                  variant="outlined"
                  color={index === 1 && answeredCount > 0 ? "success" : "default"}
                />
              ))}
            </Box>
          </Box>

          {/* Question Navigation Stepper */}
          {!isSmallMobile && questions.length > 0 && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Question Navigation
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {questions.map((_, index) => (
                  <Badge
                    key={index}
                    color="success"
                    variant="dot"
                    invisible={!answeredQuestions.has(index)}
                  >
                    <Chip
                      label={`Q${index + 1}`}
                      onClick={() => scrollToQuestion(index)}
                      variant={activeStep === index ? "filled" : "outlined"}
                      color={activeStep === index ? "primary" : "default"}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Badge>
                ))}
              </Box>
            </Paper>
          )}
        </Box>

        {/* Questions Grid */}
        {questions.length === 0 ? (
          <Box textAlign="center" py={8}>
            <InfoIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="textSecondary" gutterBottom>
              No Questions Found
            </Typography>
            <Typography variant="body1" color="textSecondary">
              There are no questions available for this quiz.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {questions.map((q, i) => (
              <Grid item xs={12} key={q._id}>
                <Slide in={true} direction="up" timeout={(i + 1) * 100}>
                  <Card 
                    id={`question-${i}`}
                    elevation={2}
                    sx={{ 
                      p: 3,
                      border: answers[i] ? `2px solid ${theme.palette.success.main}` : `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      width: 1150,
                    }}
                  >
                    <div>
                      {/* Question Header */}
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Chip 
                            label={`Question ${i + 1}`} 
                            color="primary"
                            variant="filled"
                          />
                          <Chip 
                            label={q.type.toUpperCase()} 
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Chip
                          icon={answers[i] ? <CheckCircleIcon /> : <WarningIcon />}
                          label={answers[i] ? "Answered" : "Unanswered"}
                          color={answers[i] ? "success" : "warning"}
                          variant="outlined"
                        />
                      </Box>

                      {/* Question Text */}
                      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                        {q.text}
                      </Typography>

                      {/* Options */}
                      {q.type === "mcq" ? (
                        <RadioGroup
                          value={answers[i]}
                          onChange={(e) => handleAnswerChange(q._id, e.target.value, i)}
                        >
                          <Grid container spacing={1}>
                            {q.options?.map((opt, j) => (
                              <Grid item xs={12} sm={6} key={j}>
                                <Card 
                                  variant="outlined"
                                  sx={{
                                    cursor: 'pointer',
                                    border: answers[i] === opt.text ? `2px solid ${theme.palette.primary.main}` : undefined,
                                    backgroundColor: answers[i] === opt.text ? theme.palette.primary.light : undefined,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      borderColor: theme.palette.primary.main,
                                      backgroundColor: theme.palette.action.hover
                                    }
                                  }}
                                  onClick={() => handleAnswerChange(q._id, opt.text, i)}
                                >
                                  <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                    <FormControlLabel
                                      value={opt.text}
                                      control={<Radio />}
                                      label={opt.text}
                                      sx={{ width: '100%', m: 0 }}
                                    />
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </RadioGroup>
                      ) : (
                        <TextField
                          fullWidth
                          multiline
                          rows={isMobile ? 3 : 4}
                          value={answers[i]}
                          onChange={(e) => handleAnswerChange(q._id, e.target.value, i)}
                          placeholder="Type your detailed answer here..."
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                      )}
                    </div>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Enhanced Submit Section */}
      <Paper
        elevation={8}
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
          p: 3,
          mt: 4
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={3} alignItems="center">
            {/* Progress Stats */}
            <Box display="flex" gap={3} flex={1} justifyContent="center">
              {[
                { value: answeredCount, label: 'Answered', color: 'success' },
                { value: questions.length - answeredCount, label: 'Remaining', color: 'warning' },
                { value: `${Math.round(progressPercentage)}%`, label: 'Complete', color: 'primary' }
              ].map((stat, index) => (
                <Box key={index} textAlign="center">
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: `${stat.color}.main`,
                      mx: 'auto',
                      mb: 1
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Avatar>
                  <Typography variant="body2" color="textSecondary">
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Submit Area */}
            <Box display="flex" alignItems="center" gap={3} flex={1} justifyContent="center">
              {/* Time Display */}
              <Box display="flex" alignItems="center" gap={1}>
                <TimerIcon color={timeLeft < 300 ? "error" : "primary"} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Time Remaining
                  </Typography>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    color={timeLeft < 300 ? "error.main" : "text.primary"}
                  >
                    {formatTime(timeLeft)}
                  </Typography>
                </Box>
              </Box>

              {/* Submit Button */}
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmitClick}
                disabled={answeredCount === 0}
                startIcon={<SendIcon />}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  minWidth: 200,
                  background: timeLeft < 300 ? 
                    `linear-gradient(45deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)` :
                    `linear-gradient(45deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Submit Quiz
                <Box component="span" sx={{ ml: 1, opacity: 0.9 }}>
                  ({answeredCount}/{questions.length})
                </Box>
              </Button>
            </Box>
          </Box>

          {/* Status Messages */}
          <Box mt={2}>
            {answeredCount === 0 ? (
              <Alert severity="error" icon={<ErrorIcon />}>
                <Typography variant="body2" fontWeight="bold">
                  No answers submitted
                </Typography>
                <Typography variant="body2">
                  Please answer at least one question to submit the quiz
                </Typography>
              </Alert>
            ) : answeredCount < questions.length ? (
              <Alert severity="warning" icon={<WarningIcon />}>
                <Typography variant="body2" fontWeight="bold">
                  You have unanswered questions
                </Typography>
                <Typography variant="body2">
                  {questions.length - answeredCount} questions remaining. You can still submit now.
                </Typography>
              </Alert>
            ) : (
              <Alert severity="success" icon={<CheckCircleIcon />}>
                <Typography variant="body2" fontWeight="bold">
                  All questions answered!
                </Typography>
                <Typography variant="body2">
                  Ready to submit your quiz
                </Typography>
              </Alert>
            )}
          </Box>

          {/* Quick Actions */}
          <Box display="flex" gap={1} justifyContent="center" mt={2}>
            <Button
              startIcon={<ArrowUpwardIcon />}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              size="small"
            >
              Top
            </Button>
            <Button
              startIcon={<NavigateNextIcon />}
              onClick={() => {
                const unanswered = questions.findIndex((q, i) => !answers[i]);
                if (unanswered !== -1) scrollToQuestion(unanswered);
              }}
              disabled={answeredCount === questions.length}
              size="small"
            >
              Next Unanswered
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default FieldQuestionsPage;