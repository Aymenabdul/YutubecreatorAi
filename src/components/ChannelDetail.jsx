import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Calendar, PlayCircle } from 'lucide-react';

const ChannelDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                setIsLoading(true);
                // Fetch channel details
                const channelRes = await api.get(`/channels/${id}`);
                setChannel(channelRes.data);

                // Fetch channel videos
                const videosRes = await api.get(`/channels/${id}/videos`);
                setVideos(Array.isArray(videosRes.data) ? videosRes.data : []);
            } catch (error) {
                console.error('Error fetching channel data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChannelData();
    }, [id]);

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: 'var(--text-secondary)'
            }}>
                Loading...
            </div>
        );
    }

    if (!channel) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: 'var(--text-secondary)'
            }}>
                Channel not found
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header - Back button and Channel info aligned left */}
            <div style={{ marginBottom: '3rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '0.95rem'
                    }}
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        {channel.channelName ? channel.channelName.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2rem' }}>{channel.channelName}</h1>
                        <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
                            {videos.length} Videos • Last synced {new Date(channel.lastSynced).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Video Grid - 3 columns with horizontal list-style cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem'
            }}>
                {videos.map((video) => (
                    <div
                        key={video.id}
                        onClick={() => navigate(`/video/${video.id}`)}
                        className="card"
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease, background-color 0.2s ease',
                            alignItems: 'flex-start'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(5px)';
                            e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                        }}
                    >
                        {/* Thumbnail */}
                        <div style={{ flex: '0 0 120px' }}>
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                style={{
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{
                                margin: '0 0 0.5rem 0',
                                fontSize: '0.95rem',
                                lineHeight: '1.3',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {video.title}
                            </h3>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                marginBottom: '0.5rem'
                            }}>
                                <Calendar size={12} />
                                {new Date(video.lastUpdated).toLocaleDateString()}
                            </div>
                            <p style={{
                                margin: 0,
                                color: 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                lineHeight: '1.4',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {video.description || "No description available."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @media (max-width: 1200px) {
                    div[style*="gridTemplateColumns"] {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                
                @media (max-width: 768px) {
                    div[style*="gridTemplateColumns"] {
                        grid-template-columns: repeat(1, 1fr) !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ChannelDetail;
