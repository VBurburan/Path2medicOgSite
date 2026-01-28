import { useAuth } from '../contexts/AuthContext';

export function DashboardPage() {
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student';
  const certLevel = user?.user_metadata?.certification_level || 'EMT';

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Welcome, {userName}!</h1>
        <button
          onClick={signOut}
          style={{
            padding: '10px 20px',
            background: '#eee',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>

      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Certification Level: <strong>{certLevel}</strong>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>📝 Take Diagnostic Exam</h3>
          <p style={{ color: '#666' }}>Assess your current knowledge and identify weak areas.</p>
          <button
            disabled
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              background: '#ccc',
              border: 'none',
              borderRadius: '4px',
              cursor: 'not-allowed'
            }}
          >
            Coming Soon
          </button>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>📚 Study Guides</h3>
          <p style={{ color: '#666' }}>Access our NREMT prep materials.</p>
          
            href="https://path2medic.thinkific.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '10px 20px',
              background: '#4F46E5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            View Guides
          </a>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>🎯 1-on-1 Coaching</h3>
          <p style={{ color: '#666' }}>Book a personalized session with Vincent.</p>
          
            href="https://path2medic.thinkific.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '10px 20px',
              background: '#4F46E5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Book Session
          </a>
        </div>
      </div>
    </div>
  );
}
