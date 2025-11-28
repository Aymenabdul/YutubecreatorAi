import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import VideoCard from './VideoCard';
import { Plus, LogOut, Settings as SettingsIcon, Youtube, Menu, X, RefreshCw } from 'lucide-react';
import { useVideoContext } from '../context/VideoContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { videos, channels, isLoading, fetchVideos } = useVideoContext();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchVideos(true);
        setIsRefreshing(false);
    };

    const handleSyncChannel = async (e) => {
        e.preventDefault();
        if (!newVideoUrl.trim()) {
            alert('Please enter a Channel ID');
            return;
        }

        try {
            setIsSyncing(true);
            console.log('Starting sync for channel:', newVideoUrl);

            const response = await api.post('/videos/sync', null, { params: { channelId: newVideoUrl } });
            console.log('Sync response:', response.data);

            setNewVideoUrl('');
            setShowAddModal(false);

            // Refresh videos immediately
            console.log('Fetching videos after sync...');
            await fetchVideos(true);

            alert(response.data || 'Sync completed! Videos loaded.');
        } catch (error) {
            console.error('Error syncing channel:', error);
            alert('Error syncing channel: ' + (error.response?.data || error.message));
        } finally {
            setIsSyncing(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 1001,
                    background: 'rgba(30, 41, 59, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: 'var(--glass-border)',
                    color: 'var(--text-primary)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
                className="mobile-menu-btn"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                style={{
                    width: '280px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(12px)',
                    borderRight: 'var(--glass-border)',
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    position: 'fixed',
                    height: '100vh',
                    left: 0,
                    top: 0,
                    zIndex: 1000,
                    transition: 'transform 0.3s ease',
                    overflowY: 'auto'
                }}
                className={sidebarOpen ? 'sidebar sidebar-open' : 'sidebar'}
            >
                {/* Logo/Brand */}
                <div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '1.5rem',
                        background: 'var(--primary-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '800'
                    }}>
                        Creator Analytics
                    </h1>
                    <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        AI-Powered Insights
                    </p>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={() => {
                            setShowAddModal(true);
                            setSidebarOpen(false);
                        }}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        <Plus size={20} />
                        Sync Channel
                    </button>

                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'var(--glass-border)',
                            color: 'var(--text-primary)',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            cursor: isRefreshing ? 'not-allowed' : 'pointer',
                            opacity: isRefreshing ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!isRefreshing) {
                                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isRefreshing) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }
                        }}
                    >
                        <RefreshCw size={20} className={isRefreshing ? "spin" : ""} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh Videos'}
                    </button>

                    <button
                        onClick={() => {
                            navigate('/settings');
                            setSidebarOpen(false);
                        }}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'var(--glass-border)',
                            color: 'var(--text-primary)',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <SettingsIcon size={20} />
                        Settings
                    </button>
                </nav>

                {/* Logout at bottom */}
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: '1px solid var(--accent-red)',
                        color: 'var(--accent-red)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        display: 'none'
                    }}
                    className="sidebar-overlay"
                />
            )}

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflow: 'auto', marginLeft: '280px' }} className="main-content">
                {isLoading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px',
                        color: 'var(--text-secondary)'
                    }}>
                        <p style={{ fontSize: '1.2rem' }}>Loading channels...</p>
                    </div>
                ) : channels.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                    }}>
                        <div style={{
                            textAlign: 'center', width: '100%', padding: '2rem'
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                margin: '0 auto 2rem',
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(139, 92, 246, 0.3)',
                                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)'
                            }}>
                                <Youtube size={48} color="var(--primary-color)" strokeWidth={1.5} />
                            </div>
                            <h3 style={{
                                marginBottom: '0.75rem',
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                No channels added yet
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                marginBottom: 0,
                                fontSize: '1.05rem',
                                lineHeight: '1.6'
                            }}>
                                Try to sync your YouTube channel to get started
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '1400px'
                    }}>
                        {channels.map((channel) => (
                            <div
                                key={channel.id}
                                className="card"
                                onClick={() => navigate(`/channel/${channel.id}`)}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    padding: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(139, 92, 246, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}>
                                    {channel.channelName ? channel.channelName.charAt(0).toUpperCase() : 'C'}
                                </div>
                                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{channel.channelName}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Last synced: {new Date(channel.lastSynced).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Sync Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '450px', border: '1px solid var(--primary-color)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Sync YouTube Channel</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Enter a YouTube Channel ID to automatically fetch and analyze all videos.
                        </p>
                        <form onSubmit={handleSyncChannel}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Channel ID (e.g., UC_x5XG1OV2P6uZZ5FSM9Ttw)"
                                value={newVideoUrl}
                                onChange={(e) => setNewVideoUrl(e.target.value)}
                                style={{ marginBottom: '1.5rem' }}
                                disabled={isSyncing}
                            />
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        padding: '0.5rem 1rem',
                                        cursor: 'pointer'
                                    }}
                                    disabled={isSyncing}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={isSyncing}>
                                    {isSyncing ? 'Syncing...' : 'Start Sync'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar-open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            display: block !important;
          }

          .main-content {
            margin-left: 0 !important;
            padding: 4rem 1rem 1rem !important;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 4rem 0.75rem 0.75rem !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
