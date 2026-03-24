import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { colors, fonts } from '../theme';
import Spinner from '../components/Spinner';
import { API_URL } from '../config';

const africanCountries = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Côte d'Ivoire", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe", "Non-African"
];

const countryToTimezone = {
  "Nigeria": "UTC+1", "Kenya": "UTC+3", "South Africa": "UTC+2", "Ghana": "UTC", "Rwanda": "UTC+2", "Egypt": "UTC+2"
};

const utcOffsets = Array.from({ length: 27 }, (_, i) => {
    const offset = i - 12;
    return offset >= 0 ? `+${offset}` : `${offset}`;
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  const program = location.state?.program || 'FA';
  const connectionType = location.state?.connectionType || 'find';

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', country: '', timezone: '', language: '',
    open_to_global_pairing: connectionType === 'offer' || connectionType === 'cofounder' ? 'Yes' : 'No', 
    topic_module: '', 
    learning_preferences: '', availability: '', preferred_study_setup: '2', 
    kind_of_support: '', disclaimer_agree: false,
    capacity: '3',
    meeting_preference: 'All',
    // NEW CO-FOUNDER FIELDS
    cofounder_role: 'looking', 
    skill_type: '', skill_level: '', equity_type: ''
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;

    if (name === 'country') {
        if (value === 'Non-African') {
            setFormData({ ...formData, country: value, timezone: '' });
        } else {
            const tz = countryToTimezone[value] || '';
            setFormData({ ...formData, country: value, timezone: tz });
        }
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Force Cohort 4 for FA & FLA
    const payload = { ...formData, program: program, cohort: 'Cohort 4', connection_type: connectionType };
    
    if (connectionType === 'offer' || connectionType === 'cofounder') payload.open_to_global_pairing = 'Yes';
    if (connectionType !== 'offer' && connectionType !== 'cofounder') payload.capacity = 'None'; 

    try {
      const response = await axios.post(`${API_URL}/api/register`, payload);
      if (response.data.success || response.data.user_id) {
        navigate(`/status/${response.data.user_id}`, { state: { isDuplicate: response.data.is_duplicate } });
      }
    } catch (error) { alert("Error: " + (error.response?.data?.error || error.message)); } 
    finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>&larr; Back</button>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={styles.card}>
        <h2 style={styles.header}>Register for {program} (Cohort 4)</h2>
        <p style={{textAlign:'center', marginBottom:'15px', color: '#666'}}>
            Path: <strong>{connectionType === 'cofounder' ? 'Co-Founder Matchmaker' : connectionType === 'find' ? 'Study Buddy' : connectionType === 'offer' ? 'Offer Support' : 'Request Support'}</strong>
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
           
           {/* --- CO-FOUNDER SPECIFIC FIELDS --- */}
           {connectionType === 'cofounder' && (
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '15px' }}>
                 <h3 style={{ marginTop: 0, color: colors.primary.berkeleyBlue }}>Startup Profile</h3>
                 
                 <label style={styles.label}>What is your objective?</label>
                 <select style={{...styles.select, marginBottom: '15px'}} name="cofounder_role" onChange={handleChange} required value={formData.cofounder_role}>
                     <option value="looking">I am looking for a Co-Founder</option>
                     <option value="offering">I want to be a Co-Founder</option>
                 </select>

                 <div style={styles.row}>
                    <div style={styles.half}>
                        <label style={styles.label}>{formData.cofounder_role === 'looking' ? "Skill Needed" : "Your Primary Skill"}</label>
                        <select style={styles.select} name="skill_type" onChange={handleChange} required value={formData.skill_type}>
                            <option value="">--Select Skill--</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Frontend Developer">Frontend Developer</option>
                            <option value="Accountant">Accountant</option>
                            <option value="Legal Associate">Legal Associate</option>
                            <option value="Fundraiser">Fundraiser</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Supply Chain">Supply Chain</option>
                        </select>
                    </div>
                    <div style={styles.half}>
                        <label style={styles.label}>Experience Level</label>
                        <select style={styles.select} name="skill_level" onChange={handleChange} required value={formData.skill_level}>
                            <option value="">--Select Level--</option>
                            <option value="Entry 0-2 years">Entry 0-2 years</option>
                            <option value="Midlevel 2-5 years">Midlevel 2-5 years</option>
                            <option value="Experienced 5+ years">Experienced 5+ years</option>
                            <option value="Expert 12+ years">Expert 12+ years</option>
                        </select>
                    </div>
                 </div>

                 <div style={{...styles.row, marginTop: '15px'}}>
                    <div style={styles.half}>
                        <label style={styles.label}>Compensation / Equity</label>
                        <select style={styles.select} name="equity_type" onChange={handleChange} required value={formData.equity_type}>
                            <option value="">--Select Option--</option>
                            <option value="Vesting">Vesting</option>
                            <option value="Offer Salary">Offer Salary</option>
                            <option value="Offer Equity">Offer Equity</option>
                            <option value="Can't offer any">Can't offer any</option>
                            <option value="Flexible">Flexible</option>
                        </select>
                    </div>
                    {formData.cofounder_role === 'looking' && (
                        <div style={styles.half}>
                            <label style={styles.label}>How many do you need?</label>
                            <select style={styles.select} name="capacity" onChange={handleChange} required value={formData.capacity}>
                                <option value="1">1 Co-Founder</option>
                                <option value="2">2 Co-Founders</option>
                                <option value="3">3+ Co-Founders</option>
                            </select>
                        </div>
                    )}
                 </div>
              </div>
           )}

           {/* --- STANDARD FIELDS --- */}
           <div style={styles.row}>
             <div style={styles.half}><label style={styles.label}>Full Name</label><input style={styles.input} name="name" onChange={handleChange} required /></div>
             <div style={styles.half}><label style={styles.label}>Program</label>
                <select style={styles.select} name="program" onChange={(e) => {
                    navigate('.', { state: { ...location.state, program: e.target.value }});
                }} required value={program}>
                    <option value="FA">Founders Academy (FA)</option>
                    <option value="FLA">Freelance Academy (FLA)</option>
                </select>
             </div>
           </div>

           <div style={styles.row}>
             <div style={styles.half}><label style={styles.label}>Email (ALX Registered)</label><input style={styles.input} name="email" type="email" onChange={handleChange} required /></div>
             <div style={styles.half}><label style={styles.label}>Phone (WhatsApp/Telegram)</label><input style={styles.input} name="phone" type="tel" placeholder="+123..." onChange={handleChange} required /></div>
           </div>

           <div style={styles.row}>
              <div style={styles.half}>
                  <label style={styles.label}>Country</label>
                  <select style={styles.select} name="country" onChange={handleChange} required>
                      <option value="">--Select--</option>
                      {africanCountries.map(country => (<option key={country} value={country}>{country}</option>))}
                  </select>
              </div>
              <div style={styles.half}>
                  <label style={styles.label}>Time Zone</label>
                  {formData.country === 'Non-African' ? (
                      <div style={styles.tzWrapper}>
                          <span style={{ fontWeight: 'bold', color: '#555' }}>UTC</span>
                          <select style={styles.tzSelect} name="timezone" onChange={handleChange} required value={formData.timezone}>
                              <option value="">--</option>
                              {utcOffsets.map(off => <option key={off} value={`UTC${off}`}>{off}</option>)}
                          </select>
                      </div>
                  ) : (
                      <input style={{...styles.input, backgroundColor: '#f5f5f5', color: '#888', cursor: 'not-allowed'}} name="timezone" value={formData.timezone} readOnly placeholder="Auto-filled by country" required />
                  )}
              </div>
           </div>
           
           <div style={styles.row}>
             <div style={styles.half}>
                  <label style={styles.label}>Language</label>
                  <select style={styles.select} name="language" onChange={handleChange} required>
                      <option value="">--Select--</option>
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="Arabic">Arabic</option>
                      <option value="Amharic">Amharic</option> 
                  </select>
              </div>
             <div style={styles.half}>
                <label style={styles.label}>Availability</label>
                <select style={styles.select} name="availability" onChange={handleChange} required>
                 <option value="">--Select--</option><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option><option value="Evening">Evening</option><option value="Flexible">Flexible</option>
               </select>
             </div>
           </div>

           {/* --- NON-COFOUNDER ACADEMIC PREFERENCES --- */}
           {connectionType !== 'cofounder' && (
               <div style={styles.row}>
                 <div style={styles.half}>
                    <label style={styles.label}>Current Module/Assignment</label>
                    <input style={styles.input} name="topic_module" placeholder="e.g. Marketing Quiz" onChange={handleChange} required />
                 </div>
                 <div style={styles.half}>
                    <label style={styles.label}>Why should I connect with someone?</label>
                    <select style={styles.select} name="learning_preferences" onChange={handleChange} required value={formData.learning_preferences}>
                        <option value="">--Select Reason--</option>
                        <option value="Deep dive discussion">Deep dive discussion</option>
                        <option value="Feedback and idea review">Feedback and idea review</option>
                        <option value="Co-working / accountability sessions">Co-working / accountability sessions</option>
                        <option value="Learning check-ins">Learning check-ins</option>
                        <option value="Flexible">Flexible</option>
                    </select>
                 </div>
               </div>
           )}

           <div>
              <label style={styles.label}>Preferred Meeting Method</label>
              <select style={styles.select} name="meeting_preference" onChange={handleChange} required value={formData.meeting_preference}>
                  <option value="All">Any / All</option>
                  <option value="Google Meet">Google Meet / Video</option>
                  <option value="Zoom">Zoom</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telegram">Telegram</option>
              </select>
           </div>

           {connectionType === 'offer' ? (
              <div>
                <label style={styles.label}>How many peers can you support? (Globally matched)</label>
                <select style={styles.select} name="capacity" onChange={handleChange} required value={formData.capacity}>
                    <option value="3">Up to 3 Learners</option>
                    <option value="5">Up to 5 Learners</option>
                    <option value="7">Up to 7 Learners</option>
                    <option value="10">Up to 10 Learners</option>
                </select>
              </div>
           ) : connectionType !== 'cofounder' ? (
              <div>
                <label style={styles.label}>Where do you want to match?</label>
                <select style={styles.select} name="open_to_global_pairing" onChange={handleChange} required value={formData.open_to_global_pairing}>
                   <option value="No">Match me within my Country</option>
                   <option value="Timezone">Match me within my Time Zone (±3 hours)</option>
                   <option value="Yes">Match me with anyone globally (Fastest)</option>
                </select>
              </div>
           ) : null}

           {connectionType === 'find' && (
             <div>
                <label style={styles.label}>Preferred Group Size</label>
                <select style={styles.select} name="preferred_study_setup" onChange={handleChange} required>
                    <option value="2">Pair (2 people)</option>
                    <option value="3">Group of 3</option>
                </select>
             </div>
           )}
           
           {connectionType === 'need' && (
             <div><label style={styles.label}>Support Type</label><select style={styles.select} name="kind_of_support" onChange={handleChange} required><option value="">--Select--</option><option value="Assignment Clarification">Assignment Clarification</option><option value="Technical Issue">Technical Issue</option><option value="Full support">Full support</option></select></div>
           )}

           <div style={styles.checkboxContainer}>
                <input type="checkbox" name="disclaimer_agree" onChange={handleChange} required style={{accentColor: colors.primary.iris}}/>
                <label style={{marginLeft:'10px', fontSize: '0.9rem'}}>
                    I accept the <Link to="/disclaimer" target="_blank" style={{color: colors.primary.iris, textDecoration: 'underline', fontWeight: 'bold'}}>Disclaimer</Link>.
                </label>
           </div>

           <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? <div style={{display:'flex', gap:'10px', justifyContent:'center'}}><Spinner size="20px" color="white" /> Processing...</div> : "Submit Request 🚀"}
           </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: colors.primary.berkeleyBlue, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: fonts.main },
  backBtn: { alignSelf: 'flex-start', marginBottom: '20px', background: 'transparent', border: `1px solid ${colors.secondary.electricBlue}`, color: colors.secondary.electricBlue, padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' },
  card: { background: colors.primary.white, padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
  header: { textAlign: 'center', color: colors.primary.berkeleyBlue, marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' },
  warningBox: { background: '#fffbf0', border: `1px solid ${colors.secondary.gold}`, borderRadius: '12px', padding: '15px', marginBottom: '25px', color: '#856404' },
  warningTitle: { margin: '0 0 10px 0', fontSize: '1rem', color: colors.secondary.tomato },
  warningList: { paddingLeft: '20px', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  row: { display: 'flex', gap: '15px' },
  half: { flex: 1 },
  label: { fontWeight: '600', fontSize: '0.9rem', color: colors.primary.berkeleyBlue, marginBottom: '5px', display: 'block' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box', outlineColor: colors.secondary.electricBlue },
  select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: 'white', boxSizing: 'border-box' },
  tzWrapper: { display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #ddd', borderRadius: '8px', paddingLeft: '12px', overflow: 'hidden' },
  tzSelect: { border: 'none', background: 'transparent', width: '100%', padding: '12px 5px', outline: 'none', fontSize: '1rem', cursor: 'pointer' },
  submitButton: { padding: '15px', marginTop: '20px', background: `linear-gradient(45deg, ${colors.primary.iris}, ${colors.secondary.electricBlue})`, border: 'none', borderRadius: '30px', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' },
  checkboxContainer: { display: 'flex', alignItems: 'center', marginTop: '10px' },
};

export default RegisterPage;
