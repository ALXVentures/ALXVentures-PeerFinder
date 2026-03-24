import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { colors, fonts } from '../theme';
import { API_URL } from '../config';

// --- SLIDESHOW DATA ---
const slides = [
  { id: 1, image: "/slide1.jpg", text: "Startup Matchmaker 🚀", subtext: "Find your next Co-Founder or Study Buddy." },
  { id: 2, image: "/slide2.jpg", text: "💬 Connect Instantly", subtext: "Meet via Video, WhatsApp, or Telegram." },
  { id: 3, image: "/slide3.jpg", text: "Collaborate & Build 💡", subtext: "Cross-program talent matching." },
  { id: 4, image: "/alx_white.png", text: "ALX Ventures PeerFinder", subtext: "Build together", isLogo: true }
];

const HeroSlideshow = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={styles.slideshowContainer}>
      <AnimatePresence mode='wait'>
        <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={styles.slide}>
          <div style={{ ...styles.slideBg, backgroundImage: `url(${slides[index].image})`, backgroundSize: slides[index].isLogo ? 'contain' : 'cover', backgroundRepeat: 'no-repeat' }} />
          <div style={styles.slideOverlay}>
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={styles.slideTitle}>{slides[index].text}</motion.h1>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={styles.slideSubtitle}>{slides[index].subtext}</motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/leaderboard`);
        if (res.data.success) setLeaders(res.data.leaderboard);
      } catch (err) { console.error("Error fetching leaderboard", err); }
    };
    fetchLeaders();
  }, []);

  if (leaders.length === 0) return null;

  const top3 = leaders.slice(0, 3);
  const runnersUp = leaders.slice(3);

  const getRankStyle = (index) => {
    if (index === 0) return { height: '180px', background: 'linear-gradient(to top, #FFD700, #FFB300)', badge: '🥇 1st' };
    if (index === 1) return { height: '140px', background: 'linear-gradient(to top, #E0E0E0, #9E9E9E)', badge: '🥈 2nd' };
    return { height: '110px', background: 'linear-gradient(to top, #FF8A65, #D84315)', badge: '🥉 3rd' };
  };

  const reorderedTop3 = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <section style={styles.leaderboardSection}>
      <h2 style={{ color: colors.primary.berkeleyBlue, fontSize: '2rem', marginBottom: '10px' }}>🌟 Volunteer Leaderboard</h2>
      <p style={{ color: '#555', marginBottom: '30px' }}>Celebrating our top peers who offer the most support!</p>

      <div style={styles.podiumContainer}>
        {reorderedTop3.map((leader, index) => {
          const originalIndex = top3.indexOf(leader);
          const style = getRankStyle(originalIndex);
          return (
            <motion.div key={index} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.2 }} style={styles.podiumBlockWrap}>
              <div style={styles.avatar}>👤</div>
              <div style={styles.podiumName}>{leader.name}</div>
              <div style={styles.podiumScore}>{leader.score} pts</div>
              <div style={{ ...styles.podiumPillar, height: style.height, background: style.background }}>
                {style.badge}
              </div>
            </motion.div>
          );
        })}
      </div>

      {runnersUp.length > 0 && (
        <div style={styles.runnersUpList}>
          {runnersUp.map((leader, index) => (
            <div key={index} style={styles.runnerUpCard}>
              <span style={{ fontWeight: 'bold', color: '#555' }}>#{index + 4}</span>
              <span style={{ flex: 1, textAlign: 'left', marginLeft: '15px', fontWeight: 'bold' }}>{leader.name}</span>
              <span style={{ color: colors.primary.iris, fontWeight: 'bold' }}>{leader.score} pts</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <HeroSlideshow />
      <div style={styles.content}>
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={styles.mainCard}>
          <h1 style={styles.title}>ALX Ventures PeerFinder</h1>
          <p style={styles.subtitle}>Connect with peers, find mentors, or build your startup team.</p>
          
          <div style={styles.buttonGroup}>
            {/* NEW CO-FOUNDER BUTTON */}
            <Link to="/register" state={{ program: 'FA', cohort: 'Cohort 4', connectionType: 'cofounder' }} style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.cofounderButton}>🚀 Find / Be a Co-Founder</motion.button>
            </Link>

            <Link to="/register" state={{ program: 'FA', cohort: 'Cohort 4', connectionType: 'find' }} style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.primaryButton}>🤝 Find a Study Buddy</motion.button>
            </Link>
            
            <Link to="/register" state={{ program: 'FA', cohort: 'Cohort 4', connectionType: 'offer' }} style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.secondaryButton}>🌟 Offer Support (Volunteer)</motion.button>
            </Link>

            <Link to="/register" state={{ program: 'FA', cohort: 'Cohort 4', connectionType: 'need' }} style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.tertiaryButton}>🆘 Request Support</motion.button>
            </Link>
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <Link to="/status" style={{ color: colors.primary.iris, fontWeight: 'bold', textDecoration: 'none' }}>Already registered? Check Status</Link>
          </div>
        </motion.div>
      </div>
      <Leaderboard />
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f4f6f8', fontFamily: fonts.main, display: 'flex', flexDirection: 'column' },
  slideshowContainer: { height: '50vh', position: 'relative', overflow: 'hidden', background: colors.primary.berkeleyBlue },
  slide: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  slideBg: { width: '100%', height: '100%', backgroundPosition: 'center' },
  slideOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(9, 31, 64, 0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', padding: '20px' },
  slideTitle: { fontSize: '3rem', margin: '0 0 10px 0', fontWeight: 'bold' },
  slideSubtitle: { fontSize: '1.2rem', margin: 0, opacity: 0.9 },
  content: { flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center', marginTop: '-60px', zIndex: 10 },
  mainCard: { background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '600px', width: '100%' },
  title: { color: colors.primary.berkeleyBlue, margin: '0 0 10px 0', fontSize: '2.5rem' },
  subtitle: { color: '#666', marginBottom: '30px', fontSize: '1.1rem' },
  buttonGroup: { display: 'flex', flexDirection: 'column', gap: '15px' },
  cofounderButton: { width: '100%', padding: '15px', background: colors.primary.berkeleyBlue, color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
  primaryButton: { width: '100%', padding: '15px', background: colors.primary.iris, color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  secondaryButton: { width: '100%', padding: '15px', background: 'white', color: colors.primary.iris, border: `2px solid ${colors.primary.iris}`, borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' },
  tertiaryButton: { width: '100%', padding: '15px', background: '#fff3e0', color: '#e65100', border: '1px solid #ffcc80', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' },
  
  // --- LEADERBOARD STYLES ---
  leaderboardSection: { padding: '4rem 2rem', background: 'white', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  // UPDATED: Added marginTop to create space between text and podiums
  podiumContainer: { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '15px', height: '300px', marginTop: '40px', marginBottom: '30px', maxWidth: '600px', width: '100%' },
  podiumBlockWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  avatar: { fontSize: '3rem', marginBottom: '10px' },
  podiumName: { fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' },
  podiumScore: { fontSize: '0.9rem', color: '#666', marginBottom: '10px', fontWeight: 'bold' },
  podiumPillar: { width: '100%', borderRadius: '10px 10px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#555', boxShadow: '0 -4px 10px rgba(0,0,0,0.1)' },
  runnersUpList: { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '500px' },
  runnerUpCard: { display: 'flex', alignItems: 'center', background: '#f8f9fa', padding: '15px 20px', borderRadius: '10px', border: '1px solid #eee' }
};

export default LandingPage;
