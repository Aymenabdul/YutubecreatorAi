import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    const [primaryColor, setPrimaryColor] = useState('#8b5cf6');
    const [secondaryColor, setSecondaryColor] = useState('#10b981');
    const [bgDark, setBgDark] = useState('#0b0f19');

    useEffect(() => {
        // Load current values from CSS variables
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        setPrimaryColor(styles.getPropertyValue('--primary-color').trim());
        setSecondaryColor(styles.getPropertyValue('--secondary-color').trim());
        setBgDark(styles.getPropertyValue('--bg-dark').trim());
    }, []);

    const handleSave = () => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', primaryColor);
        root.style.setProperty('--secondary-color', secondaryColor);
        root.style.setProperty('--bg-dark', bgDark);

        // Update gradient for primary
        root.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`);

        // In a real app, save to backend or localStorage
        alert('Theme updated!');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontSize: '1rem' }}>
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: 'var(--glass-border)', paddingBottom: '1rem' }}>
                    <div style={{ background: 'var(--primary-gradient)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                        <Palette size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Theme Settings</h2>
                        <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)' }}>Customize the look and feel of your dashboard</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>Primary Color</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', padding: 0, margin: 0, cursor: 'pointer', border: 'none' }}
                                />
                            </div>
                            <input
                                type="text"
                                className="input"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                style={{ fontFamily: 'monospace' }}
                            />
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>Secondary Color</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                                <input
                                    type="color"
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', padding: 0, margin: 0, cursor: 'pointer', border: 'none' }}
                                />
                            </div>
                            <input
                                type="text"
                                className="input"
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                style={{ fontFamily: 'monospace' }}
                            />
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: 'var(--glass-border)' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>Background Color</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                                <input
                                    type="color"
                                    value={bgDark}
                                    onChange={(e) => setBgDark(e.target.value)}
                                    style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', padding: 0, margin: 0, cursor: 'pointer', border: 'none' }}
                                />
                            </div>
                            <input
                                type="text"
                                className="input"
                                value={bgDark}
                                onChange={(e) => setBgDark(e.target.value)}
                                style={{ fontFamily: 'monospace' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 2rem' }}>
                        <Save size={20} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
