import { Eye, ThumbsUp, MessageCircle, TrendingUp, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({ video }) => {
    const navigate = useNavigate();
    const stats = video.stats && video.stats.length > 0 ? video.stats[video.stats.length - 1] : {};

    return (
        <div
            className="card"
            onClick={() => navigate(`/video/${video.id}`)}
            style={{
                cursor: 'pointer',
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'all 0.3s ease',
                position: 'relative'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.3)';
                e.currentTarget.style.borderColor = 'var(--primary-color)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
        >
            {/* Thumbnail with Overlay */}
            <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                />

                {/* Play Button Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(139, 92, 246, 0.9)',
                    backdropFilter: 'blur(10px)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                }}
                    className="play-overlay"
                >
                    <Play size={28} color="white" fill="white" />
                </div>

                {/* Gradient Overlay for Title */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                    padding: '3rem 1.25rem 1.25rem',
                }}>
                    <h3 style={{
                        fontSize: '1.05rem',
                        margin: 0,
                        color: 'white',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                        fontWeight: '600',
                        lineHeight: '1.4'
                    }}>
                        {video.title}
                    </h3>
                </div>

                {/* Trending Badge */}
                {stats.viewCount > 1000 && (
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#000',
                        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
                    }}>
                        <TrendingUp size={14} />
                        TRENDING
                    </div>
                )}
            </div>

            {/* Stats Section */}
            <div style={{
                padding: '1.25rem',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                borderTop: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '0.75rem'
                }}>
                    {/* Views */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}>
                        <div style={{
                            background: 'rgba(139, 92, 246, 0.15)',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex'
                        }}>
                            <Eye size={16} color="var(--primary-color)" />
                        </div>
                        <span style={{
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            color: 'var(--text-primary)'
                        }}>
                            {stats.viewCount?.toLocaleString() || 0}
                        </span>
                        <span style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Views
                        </span>
                    </div>

                    {/* Likes */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}>
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex'
                        }}>
                            <ThumbsUp size={16} color="var(--accent-green)" />
                        </div>
                        <span style={{
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            color: 'var(--text-primary)'
                        }}>
                            {stats.likeCount?.toLocaleString() || 0}
                        </span>
                        <span style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Likes
                        </span>
                    </div>

                    {/* Comments */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}>
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex'
                        }}>
                            <MessageCircle size={16} color="#3b82f6" />
                        </div>
                        <span style={{
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            color: 'var(--text-primary)'
                        }}>
                            {stats.commentCount?.toLocaleString() || 0}
                        </span>
                        <span style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Comments
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                .card:hover .play-overlay {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default VideoCard;
