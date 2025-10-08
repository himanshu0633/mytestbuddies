import React, { useState } from "react";
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Typography, 
  Box, 
  Paper,
  Chip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  IconButton,
  Container
} from "@mui/material";
import { Link } from 'react-router-dom';

// Import images
import M4 from '../image/m4.jpg';
import M3 from '../image/m3.webp';
import iPhone17 from '../image/iphone17.jpg';
import iPhone16 from '../image/iphone-16.webp';
import SamsungS24 from '../image/24.webp';
import Pixel9A from '../image/Google_Pixel_9A-removebg-preview.png';
import OnePlus11 from '../image/oneplus_11.jpg';
import swift from '../image/swift.jpg';
import punch from '../image/punch.avif';
import gt650 from '../image/gt650.jpeg'; 
import bullet from '../image/350.jpg';
import apache from '../image/apache.jpg';
import hero from '../image/hero.avif';
import samsung from '../image/s24.jpg';

// Use emojis as icons for better compatibility and no dependencies
const CelebrationIcon = () => <span style={{ fontSize: '18px' }}>🎉</span>;
const EmojiEventsIcon = () => <span style={{ fontSize: '18px' }}>🏆</span>;
const SchoolIcon = () => <span style={{ fontSize: '18px' }}>🎓</span>;
const PeopleIcon = () => <span style={{ fontSize: '18px' }}>👥</span>;
const CloseIcon = () => <span style={{ fontSize: '20px', fontWeight: 'bold' }}>✕</span>;

// TabPanel component for better accessibility
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`prize-tabpanel-${index}`}
      aria-labelledby={`prize-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function DiwaliQuizCard({
  price = 250,
  discountAmount = 150,
  discountedPrice = 100,
  validUntil = '15 Oct',
}) {
  const [showPrizesFor, setShowPrizesFor] = useState(0);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const studentPrizes = [
    { name: 'MacBook Air M4', rank: '1st Prize', image: M4, value: '₹1,50,000' },
    { name: 'MacBook Air M3', rank: '2nd Prize', image: M3, value: '₹1,20,000' },
    { name: 'iPhone 17', rank: '3rd Prize', image: iPhone17, value: '₹90,000' },
    { name: 'iPhone 16', rank: '4th-6th Prize', image: iPhone16, value: '₹70,000' },
    { name: 'Samsung S24', rank: '7th-10th Prize', image: SamsungS24, value: '₹60,000' },
    { name: 'Google Pixel 9A', rank: '11th-20th Prize', image: Pixel9A, value: '₹40,000' },
    { name: 'OnePlus 11', rank: '21st-30th Prize', image: OnePlus11, value: '₹35,000' },
  ];

  const everyonePrizes = [
    { name: 'Swift VDI', rank: '1st Prize', image: swift, value: '₹8,00,000' },
    { name: 'Punch', rank: '2nd Prize', image: punch, value: '₹6,00,000' },
    { name: 'GT650', rank: '3rd Prize', image: gt650, value: '₹3,50,000' },
    { name: 'Bullet Classic 350', rank: '4th-6th Prize', image: bullet, value: '₹1,80,000' },
    { name: 'Apache RTR150', rank: '7th-10th Prize', image: apache, value: '₹1,20,000' },
    { name: 'Hero Splender', rank: '11th-15th Prize', image: hero, value: '₹80,000' },
    { name: 'Samsung S24', rank: '16th-20th Prize', image: samsung, value: '₹60,000' },
  ];

  const PrizeCard = ({ prize, index }) => (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: isMobile ? 'none' : 'translateY(-8px)',
          boxShadow: isMobile ? '0 4px 12px rgba(0,0,0,0.15)' : '0 12px 28px rgba(0,0,0,0.2)',
        }
      }}
    >
      <CardMedia
        component="img"
        height={isSmallMobile ? "120" : "140"}
        image={prize.image}
        alt={prize.name}
        sx={{ 
          objectFit: 'contain', 
          p: 1, 
          backgroundColor: '#f8f9fa',
          maxHeight: isSmallMobile ? 120 : 140
        }}
      />
      <CardContent sx={{ textAlign: 'center', p: isSmallMobile ? 1 : 2 }}>
        <Chip 
          label={prize.rank} 
          color="primary" 
          size="small" 
          sx={{ 
            mb: 1, 
            fontWeight: 'bold',
            fontSize: isSmallMobile ? '0.7rem' : '0.8rem',
            height: isSmallMobile ? 24 : 32
          }}
        />
        <Typography 
          variant={isSmallMobile ? "body1" : "h6"} 
          sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            fontSize: isSmallMobile ? '0.9rem' : '1rem'
          }}
        >
          {prize.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="success.main" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: isSmallMobile ? '0.8rem' : '0.9rem'
          }}
        >
          {prize.value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 }, py: 2 }}>
      <Paper 
        elevation={isMobile ? 4 : 8} 
        sx={{ 
          borderRadius: { xs: 2, md: 4 }, 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd700 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, transparent 50%)',
          }
        }}
      >
        {/* Decorative elements */}
        {!isMobile && (
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
        )}
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={0}>
            {/* Left Content */}
            <Grid item xs={12} md={8}>
              <Box sx={{ 
                p: { xs: 2, sm: 3, md: 4 }, 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                {/* Header Section */}
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    flexWrap: 'wrap', 
                    mb: 2,
                    justifyContent: { xs: 'center', sm: 'flex-start' }
                  }}>
                    <Chip 
                      icon={<CelebrationIcon />}
                      label="Diwali Special" 
                      sx={{ 
                        backgroundColor: '#ffd700',
                        color: '#d35400',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.7rem', sm: '0.9rem' },
                        py: { xs: 1, sm: 2 },
                        height: { xs: 32, sm: 40 }
                      }}
                    />
                    {/* {validUntil && (
                      <Chip 
                        label={`Until ${validUntil}`}
                        variant="outlined"
                        sx={{ 
                          borderColor: '#ff6b35',
                          color: '#ff6b35',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          height: { xs: 32, sm: 40 }
                        }}
                      />
                    )} */}
                  </Box>

                  <Typography 
                    variant={isMobile ? "h4" : "h3"}
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    Mega Quiz Contest 2025
                  </Typography>
                  
                  <Typography 
                    variant={isMobile ? "body1" : "h6"} 
                    sx={{ 
                      mb: 3, 
                      color: 'text.secondary', 
                      lineHeight: 1.6,
                      textAlign: { xs: 'center', sm: 'left' },
                      fontSize: { xs: '0.9rem', sm: '1.1rem' }
                    }}
                  >
                    Join the festive celebration on <strong>MyTestBuddies</strong> — test your knowledge and win incredible prizes worth lakhs! <br />
                     Mega Quiz on 10th To 16th of October
                  </Typography>
                </Box>

                {/* Pricing Section */}
                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary', 
                            mb: 1,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}
                        >
                          Original Price
                        </Typography>
                        <Typography 
                          variant={isMobile ? "h5" : "h4"}
                          sx={{ 
                            fontWeight: 'bold',
                            textDecoration: 'line-through',
                            color: 'text.disabled',
                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                          }}
                        >
                          ₹{price}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        textAlign: { xs: 'center', sm: 'left' },
                        p: { xs: 2, sm: 3 },
                        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                        borderRadius: { xs: 2, sm: 3 },
                        color: 'white'
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            opacity: 0.9,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}
                        >
                          Mega Special Price
                        </Typography>
                        <Typography 
                          variant={isMobile ? "h4" : "h3"}
                          sx={{ 
                            fontWeight: 'bold', 
                            mb: 1,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                          }}
                        >
                          ₹{discountedPrice}
                        </Typography>
                        <Chip 
                          label={`Save ₹${discountAmount} • 60% OFF`}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            height: { xs: 24, sm: 32 }
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  flexWrap: 'wrap', 
                  mb: 3,
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Button 
                      variant="contained" 
                      size={isMobile ? "medium" : "large"}
                      sx={{
                        py: { xs: 1, sm: 1.5 },
                        px: { xs: 2, sm: 4 },
                        fontSize: { xs: '0.8rem', sm: '1.1rem' },
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
                        minWidth: { xs: '120px', sm: '140px' },
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e55a2b, #e0841b)',
                          boxShadow: '0 6px 16px rgba(255, 107, 53, 0.6)',
                        }
                      }}
                    >
                      {isMobile ? '🎯 Register' : '🎯 Register Now'}
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="outlined" 
                    size={isMobile ? "medium" : "large"}
                    onClick={() => setOpen(true)}
                    startIcon={<EmojiEventsIcon />}
                    sx={{
                      py: { xs: 1, sm: 1.5 },
                      px: { xs: 2, sm: 4 },
                      fontSize: { xs: '0.8rem', sm: '1.1rem' },
                      fontWeight: 'bold',
                      borderColor: '#ff6b35',
                      color: '#ff6b35',
                      minWidth: { xs: '120px', sm: '140px' },
                      '&:hover': {
                        borderColor: '#e55a2b',
                        backgroundColor: 'rgba(255, 107, 53, 0.04)',
                      }
                    }}
                  >
                    {isMobile ? 'Prizes' : 'View Prizes'}
                  </Button>
                </Box>

                {/* Tip Section */}
                <Box sx={{ 
                  p: { xs: 1.5, sm: 2 }, 
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 107, 53, 0.2)'
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontStyle: 'italic', 
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', sm: '0.9rem' }
                    }}
                  >
                    💡 <strong>Pro Tip:</strong> Students get tech prizes, Everyone gets vehicles & phones!
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right: How to Participate */}
           
              <Box sx={{ 
                p: { xs: 5, sm: 3, md: 4 }, 
                height: '100%',
                background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.9), rgba(247, 147, 30, 0.9))',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: { xs: '500px', md: 'auto' } 
              }}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 2, 
                    textAlign: 'center',
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                  }}
                >
                  🎁 How to Participate
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { step: '1', text: 'Register with Diwali discount' },
                    { step: '2', text: 'Your Mega Quiz Test will be available after 12 hours!' },
                    
                    { step: '3', text: 'Check leaderboard on 17th of October for results' },
                    { step: '4', text: 'Claim your Mega Quiz prizes!' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box sx={{
                        width: { xs: 28, sm: 32 },
                        height: { xs: 28, sm: 32 },
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        color: '#ff6b35',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        flexShrink: 0
                      }}>
                        {item.step}
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          lineHeight: 1.4,
                          fontSize: { xs: '0.75rem', sm: '0.9rem' }
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            
          </Grid>
        </Box>
      </Paper>

      {/* Enhanced Prize Dialog - Mobile Optimized */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={isSmallMobile}
        PaperProps={{
          sx: {
            borderRadius: isSmallMobile ? 0 : 4,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            maxHeight: isSmallMobile ? '100vh' : '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
          color: 'white',
          position: 'relative',
          py: { xs: 2, sm: 3 }
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ 
              fontWeight: 'bold', 
              textAlign: 'center',
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
            }}
          >
            🏆 Mega Contest Prizes
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 16 },
              top: { xs: 8, sm: 16 },
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, overflow: 'auto' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={showPrizesFor} 
              onChange={(e, newValue) => setShowPrizesFor(newValue)}
              centered
              variant={isSmallMobile ? "fullWidth" : "standard"}
              sx={{
                '& .MuiTab-root': {
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  fontWeight: 'bold',
                  py: { xs: 1.5, sm: 2 },
                  minWidth: { xs: 'auto', sm: '160px' },
                  minHeight: { xs: '48px', sm: '64px' }
                }
              }}
            >
              <Tab 
                icon={isSmallMobile ? null : <SchoolIcon />}
                iconPosition="start"
                label={isSmallMobile ? "Students" : "Students Category"} 
              />
              <Tab 
                icon={isSmallMobile ? null : <PeopleIcon />}
                iconPosition="start"
                label={isSmallMobile ? "Everyone" : "Everyone Category"} 
              />
            </Tabs>
          </Box>

          <TabPanel value={showPrizesFor} index={0}>
            <Grid container spacing={isSmallMobile ? 1 : 2}>
              {studentPrizes.map((prize, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <PrizeCard prize={prize} index={index} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={showPrizesFor} index={1}>
            <Grid container spacing={isSmallMobile ? 1 : 2}>
              {everyonePrizes.map((prize, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <PrizeCard prize={prize} index={index} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </DialogContent>
        
        <DialogActions sx={{ p: { xs: 2, sm: 3 }, justifyContent: 'center' }}>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button 
              variant="contained" 
              size={isMobile ? "medium" : "large"}
              sx={{
                py: { xs: 1, sm: 1.5 },
                px: { xs: 3, sm: 4 },
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                minWidth: { xs: '140px', sm: '160px' }
              }}
              onClick={() => setOpen(false)}
            >
              {isMobile ? 'Join Now' : 'Join Contest Now'}
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </Container>
  );
}