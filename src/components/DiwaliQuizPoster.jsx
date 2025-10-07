import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, Paper } from "@mui/material";
import { Link } from 'react-router-dom';

export default function DiwaliQuizCard({
  price = 250,
  discountAmount = 150,
  discountedPrice = 100,
  onBuy = () => alert('Buy clicked'),
  onJoin = () => alert('Join clicked'),
  validUntil = '', // optional string like '15 Oct'
}) {
  const [showPrizesFor, setShowPrizesFor] = useState('students');
  const [open, setOpen] = useState(false);

  const studentPrizes = [
    { name: '1st: MacBook Air M4', image: 'path_to_macbook_image' },
    { name: '2nd: MacBook Air M3', image: 'path_to_macbook_image' },
    { name: '3rd: iPhone 17', image: 'path_to_iphone_image' },
    { name: '4th-6th: iPhone 16', image: 'path_to_iphone_image' },
    { name: '7th-10th: Samsung S24', image: 'path_to_samsung_image' },
    { name: '11th-20th: Google Pixel 9A', image: 'path_to_pixel_image' },
  ];

  const everyonePrizes = [
    { name: '1st: Swift VDI', image: 'path_to_swift_image' },
    { name: '2nd: Punch', image: 'path_to_punch_image' },
    { name: '3rd: GT650', image: 'path_to_gt650_image' },
    { name: '4th-6th: Bullet Classic 350', image: 'path_to_bullet_image' },
    { name: '7th-10th: Apache RTR150', image: 'path_to_apache_image' },
    { name: '11th-15th: Hero Splender', image: 'path_to_hero_image' },
    { name: '16th-20th: Samsung S24', image: 'path_to_samsung_image' },
  ];

  const PrizeList = ({ list }) => (
    <ul>
      {list.map((p, i) => (
        <li key={i}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <img src={p.image} alt={p.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              <strong>{i+1}.</strong> {p.name}
            </Typography>
          </Box>
        </li>
      ))}
    </ul>
  );

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: { md: 'row', xs: 'column' }, p: 2 }}>
          {/* Left: Artwork */}
          <Box sx={{ flex: 1, background: 'linear-gradient(180deg, rgba(255,230,179,0.8), transparent)', p: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ backgroundColor: 'yellow', padding: '0.5em', borderRadius: '20px' }}>
                  🎉 Diwali Special
                </Typography>
                {validUntil && (
                  <Typography variant="body2" sx={{ ml: 'auto', fontSize: '0.75rem' }}>
                    Valid until <strong>{validUntil}</strong>
                  </Typography>
                )}
              </Box>

              <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: 'amber.main' }}>
                Diwali Special Quiz Contest
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Join the fun on <strong>MyTestBuddies</strong> — test your knowledge and win amazing prizes for Students and Everyone!
              </Typography>

              <Box sx={{ mt: 3, display: 'flex', gap: 3 }}>
                <Box sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Original</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>₹{price}</Typography>
                </Box>

                <Box sx={{ p: 2, backgroundColor: 'gradient', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Diwali Price</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>₹{discountedPrice}</Typography>
                  <Typography variant="body2" sx={{ color: 'success.main' }}>
                    Save ₹{discountAmount} · ₹100 OFF
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 3 }}>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">
                    Register 
                  </Button>
                </Link>
                <Button variant="outlined" onClick={() => setOpen(true)}>
                  View Prizes
                </Button>
              </Box>

              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Tip: Students category has tech prizes like MacBooks and iPhones. Everyone category includes vehicles & phones.
              </Typography>
            </Box>
            <Box sx={{ mt: 3, color: 'text.secondary', p: 4 }}>
              <Typography variant="body2" fontWeight="bold">How to participate:</Typography>
              <ol>
                <li><Typography variant="body2">Click <em>Register</em> to purchase the quiz entry.</Typography></li>
                <li><Typography variant="body2">Complete the quiz on MyTestBuddies before the contest closes.</Typography></li>
                <li><Typography variant="body2">Winners will be announced on the platform.</Typography></li>
              </ol>
            </Box>
          </Box>

        </Box>
      </Paper>

      {/* Modal: Prize details */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Prize Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={showPrizesFor === 'students' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setShowPrizesFor('students')}
            >
              Students
            </Button>
            <Button
              variant={showPrizesFor === 'everyone' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setShowPrizesFor('everyone')}
            >
              Everyone
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            {showPrizesFor === 'students' ? <PrizeList list={studentPrizes} /> : <PrizeList list={everyonePrizes} />}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); onBuy(); }} color="primary">Register</Button>
          <Button onClick={() => { setOpen(false); onJoin(); }} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
