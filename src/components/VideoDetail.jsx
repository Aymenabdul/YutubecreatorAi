import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { LineChart, Line, XAxis, YAxis, LabelList, Cell, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft, ThumbsUp, Eye, MessageSquare, TrendingUp, Calendar, Sparkles, Activity, Target } from 'lucide-react';

const VideoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [video, setVideo] = useState(null);

    // Helper function to format AI feedback text into structured JSX
    const formatFeedbackText = (text) => {
        if (!text || text.includes("Analyzing")) {
            return <p style={{ margin: 0, fontStyle: 'italic', opacity: 0.7 }}>{text}</p>;
        }

        // First, split by numbered items (1. 2. 3. etc) to ensure they're on separate lines
        let processedText = text;
        // Add newlines before numbered items if they're not already there
        processedText = processedText.replace(/(\d+)\.\s+/g, '\n$1. ');

        const lines = processedText.split('\n').filter(line => line.trim());
        const formatted = [];
        let currentList = [];
        let listType = null;

        lines.forEach((line, index) => {
            const trimmed = line.trim();

            // Check for numbered items (1., 2., etc.)
            const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
            // Check for bullet points (*, -, •)
            const bulletMatch = trimmed.match(/^[*\-•]\s+(.+)/);
            // Check for sub-items with extra indentation
            const subItemMatch = trimmed.match(/^\s{4,}[*\-•]\s+(.+)/);

            if (numberedMatch) {
                if (currentList.length > 0 && listType !== 'numbered') {
                    formatted.push(renderList(currentList, listType));
                    currentList = [];
                }
                listType = 'numbered';
                currentList.push({ number: numberedMatch[1], text: numberedMatch[2] });
            } else if (bulletMatch || subItemMatch) {
                if (currentList.length > 0 && listType !== 'bullet') {
                    formatted.push(renderList(currentList, listType));
                    currentList = [];
                }
                listType = 'bullet';
                const text = bulletMatch ? bulletMatch[1] : subItemMatch[1];
                currentList.push({ text, indent: !!subItemMatch });
            } else {
                // Regular paragraph
                if (currentList.length > 0) {
                    formatted.push(renderList(currentList, listType));
                    currentList = [];
                    listType = null;
                }
                if (trimmed) {
                    formatted.push(
                        <p key={index} style={{ margin: '0 0 0.75rem 0', lineHeight: '1.8' }}>
                            {formatInlineText(trimmed)}
                        </p>
                    );
                }
            }
        });

        // Push any remaining list
        if (currentList.length > 0) {
            formatted.push(renderList(currentList, listType));
        }

        return <div>{formatted}</div>;
    };

    const renderList = (items, type) => {
        const key = `list-${Math.random()}`;
        if (type === 'numbered') {
            return (
                <div key={key} style={{ margin: '0 0 1rem 0' }}>
                    {items.map((item, i) => (
                        <div key={i} style={{
                            marginBottom: '1rem',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-start'
                        }}>
                            <span style={{
                                backgroundColor: 'var(--primary-color)',
                                color: '#0a0e1a',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                minWidth: '1.5rem',
                                textAlign: 'center',
                                flexShrink: 0
                            }}>
                                {item.number}
                            </span>
                            <span style={{
                                color: 'var(--text-secondary)',
                                lineHeight: '1.8',
                                flex: 1
                            }}>
                                {formatInlineText(item.text)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <ul key={key} style={{ margin: '0 0 1rem 0', paddingLeft: '1.25rem', listStyle: 'none' }}>
                    {items.map((item, i) => (
                        <li key={i} style={{
                            marginBottom: '0.5rem',
                            paddingLeft: item.indent ? '1rem' : '0',
                            position: 'relative'
                        }}>
                            <span style={{
                                color: 'var(--primary-color)',
                                marginRight: '0.5rem',
                                fontSize: '0.8rem'
                            }}>▸</span>
                            {formatInlineText(item.text)}
                        </li>
                    ))}
                </ul>
            );
        }
    };

    const formatInlineText = (text) => {
        // Handle bold text (**text**)
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ color: '#f8fafc' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchVideo = async () => {
        try {
            setIsRefreshing(true);
            const response = await api.get(`/videos/${id}`);
            console.log('Video data received:', response.data);
            console.log('AI Feedback:', response.data.aiFeedback);
            setVideo(response.data);
        } catch (error) {
            console.error('Error fetching video:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchVideo();
    }, [id]);

    if (!video) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            color: 'white'
        }}>
            Loading...
        </div>
    );

    const latestStats = video.stats && video.stats.length > 0 ? video.stats[video.stats.length - 1] : {};
    const feedback = video.aiFeedback || {};
    const hasFeedback = feedback.contentFeedback || feedback.visualFeedback || feedback.seoTips;

    console.log('Feedback being used:', feedback);

    // Format data for line chart
    const chartData = video.stats ? video.stats.map(s => ({
        name: new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: s.viewCount,
        likes: s.likeCount,
        comments: s.commentCount
    })) : [];

    // Calculate average daily metrics
    const statsCount = video.stats ? video.stats.length : 0;
    const totalViews = video.stats ? video.stats.reduce((sum, s) => sum + (s.viewCount || 0), 0) : 0;
    const totalLikes = video.stats ? video.stats.reduce((sum, s) => sum + (s.likeCount || 0), 0) : 0;
    const totalComments = video.stats ? video.stats.reduce((sum, s) => sum + (s.commentCount || 0), 0) : 0;
    const avgViews = statsCount ? Math.round(totalViews / statsCount) : 0;
    const avgLikes = statsCount ? Math.round(totalLikes / statsCount) : 0;
    const avgComments = statsCount ? Math.round(totalComments / statsCount) : 0;

    // Format data for bar chart (engagement)
    const engagementData = [
        { name: 'Views', value: latestStats.viewCount || 0, color: '#8b5cf6' },
        { name: 'Likes', value: latestStats.likeCount || 0, color: '#10b981' },
        { name: 'Comments', value: latestStats.commentCount || 0, color: '#3b82f6' }
    ];

    const engagementRate = latestStats.viewCount > 0
        ? (((latestStats.likeCount || 0) + (latestStats.commentCount || 0)) / latestStats.viewCount * 100).toFixed(2)
        : 0;

    return (
        <div style={{ height: '100%', width: '100%', padding: '2rem 0', background: 'rgba(10, 14, 26, 0.3)' }}>
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: 'var(--glass-border)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 2rem 2rem 2rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            {/* SECTION 1: Video Info */}
            <div className="card section-1" style={{
                width: '100%',
                padding: '2rem',
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
            }}>
                {/* Row 1: Thumbnail, Title and Date */}
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'flex-start',
                    marginBottom: '2rem'
                }}>
                    {/* Thumbnail */}
                    <div style={{ flex: '0 0 350px' }}>
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid rgba(139, 92, 246, 0.3)',
                                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.25)'
                            }}
                        />
                    </div>

                    {/* Title and Date */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            margin: '0 0 1rem 0',
                            fontSize: '2.5rem',
                            lineHeight: '1.2',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {video.title}
                        </h1>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-secondary)',
                            fontSize: '1rem'
                        }}>
                            <Calendar size={18} />
                            <span>Last updated: {new Date(video.lastUpdated).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Stats */}
                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    <div className="stat-card stat-views">
                        <Eye size={22} color="var(--primary-color)" />
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)', margin: '0.5rem 0 0.25rem' }}>
                            {latestStats.viewCount?.toLocaleString() || 0}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Views
                        </div>
                    </div>

                    <div className="stat-card stat-likes">
                        <ThumbsUp size={22} color="var(--accent-green)" />
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-green)', margin: '0.5rem 0 0.25rem' }}>
                            {latestStats.likeCount?.toLocaleString() || 0}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Likes
                        </div>
                    </div>

                    <div className="stat-card stat-comments">
                        <MessageSquare size={22} color="#3b82f6" />
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', margin: '0.5rem 0 0.25rem' }}>
                            {latestStats.commentCount?.toLocaleString() || 0}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Comments
                        </div>
                    </div>

                    <div className="stat-card stat-sentiment">
                        <TrendingUp size={22} color="#fbbf24" />
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', justifyContent: 'center', margin: '0.5rem 0 0.25rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>
                                {latestStats.positiveComments || 0}
                            </span>
                            <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ef4444' }}>
                                {latestStats.negativeComments || 0}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Sentiment
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: Growth Trajectory - 100% Width */}
            <div className="card section-2" style={{
                width: '100%',
                padding: '2rem',
                marginBottom: '2rem'
            }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: '700'
                }}>
                    <TrendingUp size={24} color="var(--primary-color)" />
                    Growth Trajectory
                </h3>
                <div style={{ height: '400px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem'
                                }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                            <Line type="monotone" dataKey="likes" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                            <Line type="monotone" dataKey="comments" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-around', color: 'var(--text-primary)' }}>
                    <div><strong>Avg Views/day:</strong> {avgViews?.toLocaleString()}</div>
                    <div><strong>Avg Likes/day:</strong> {avgLikes?.toLocaleString()}</div>
                    <div><strong>Avg Comments/day:</strong> {avgComments?.toLocaleString()}</div>
                </div>
            </div>

            {/* SECTION 3: Engagement - 100% Width */}
            <div className="card section-3" style={{
                width: '100%',
                padding: '2rem',
                marginBottom: '2rem',
                display: 'flex',
                gap: '2rem',
                alignItems: 'stretch'
            }}>
                {/* Engagement & Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Engagement Rate Card */}
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>📈</span> Engagement Analysis
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                position: 'relative',
                                width: '100px',
                                height: '100px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '50%',
                                background: `conic-gradient(var(--primary-color) ${feedback.engagementScore || 0}%, #2a2a2a 0)`
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    width: '85px',
                                    height: '85px',
                                    backgroundColor: 'var(--card-bg)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>
                                        {feedback.engagementScore || 0}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>SCORE</span>
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>
                                    {feedback.engagementScore >= 70 ? 'High Engagement' :
                                        feedback.engagementScore >= 40 ? 'Moderate Engagement' : 'Low Engagement'}
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                    {feedback.engagementAnalysis || "AI is analyzing the engagement potential of your content..."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Engagement Breakdown Chart */}
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid var(--border-color)'
                    }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>📊</span> Engagement Breakdown
                        </h3>
                        <div style={{ height: '200px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Likes', value: latestStats.likeCount || 0, fill: '#8884d8' },
                                    { name: 'Comments', value: latestStats.commentCount || 0, fill: '#82ca9d' },
                                    { name: 'Shares', value: 0, fill: '#ffc658' } // Placeholder for shares
                                ]} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'var(--text-secondary)' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                                        <LabelList dataKey="value" position="insideRight" fill="white" offset={10} style={{ fontWeight: 'bold' }} />
                                        {
                                            [
                                                { name: 'Likes', value: latestStats.likeCount || 0, fill: '#8884d8' },
                                                { name: 'Comments', value: latestStats.commentCount || 0, fill: '#82ca9d' },
                                                { name: 'Shares', value: 0, fill: '#ffc658' }
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: AI Insights - Flex Layout - 100% Width */}
            <div className="card section-4" style={{
                width: '100%',
                padding: '2rem',
                background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, rgba(30, 41, 59, 0.6) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.25)'
            }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: '700'
                }}>
                    <Sparkles size={24} color="var(--primary-color)" />
                    AI Insights
                </h3>
                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    {/* Content Strategy */}
                    <div style={{
                        flex: '1 1 300px',
                        background: 'rgba(139, 92, 246, 0.08)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(139, 92, 246, 0.15)'
                    }}>
                        <h4 style={{
                            color: '#a78bfa',
                            marginBottom: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            📊 Content Strategy
                        </h4>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            {formatFeedbackText(feedback.contentFeedback || "Analyzing your content...")}
                        </div>
                    </div>

                    {/* Visual Improvements */}
                    <div style={{
                        flex: '1 1 300px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(16, 185, 129, 0.15)'
                    }}>
                        <h4 style={{
                            color: '#34d399',
                            marginBottom: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            🎨 Visual Improvements
                        </h4>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            {formatFeedbackText(feedback.visualFeedback || "Analyzing visuals...")}
                        </div>
                    </div>

                    {/* SEO Optimization */}
                    <div style={{
                        flex: '1 1 300px',
                        background: 'rgba(59, 130, 246, 0.08)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(59, 130, 246, 0.15)'
                    }}>
                        <h4 style={{
                            color: '#38bdf8',
                            marginBottom: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            🔍 SEO Optimization
                        </h4>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            {formatFeedbackText(feedback.seoTips || "Generating SEO tips...")}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .stat-card {
                    flex: 1 1 200px;
                    padding: 1.25rem;
                    border-radius: var(--radius-md);
                    text-align: center;
                    transition: transform 0.2s ease;
                }

                .stat-card:hover {
                    transform: translateY(-3px);
                }

                .stat-views {
                    background: rgba(139, 92, 246, 0.15);
                    border: 1px solid rgba(139, 92, 246, 0.3);
                }

                .stat-likes {
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .stat-comments {
                    background: rgba(59, 130, 246, 0.15);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                }

                .stat-sentiment {
                    background: rgba(251, 191, 36, 0.15);
                    border: 1px solid rgba(251, 191, 36, 0.3);
                }

                @media (max-width: 1200px) {
                    .section-1 > div:first-child {
                        flex-direction: column;
                    }

                    .section-1 > div:first-child > div:first-child {
                        flex: 0 0 auto;
                        width: 100%;
                        max-width: 500px;
                    }

                    .section-3 {
                        flex-direction: column !important;
                    }

                    .section-3 > div:first-child {
                        flex: 0 0 auto !important;
                    }
                }

                @media (max-width: 768px) {
                    .section-1 > div:last-child {
                        flex-direction: column;
                    }

                    .stat-card {
                        flex: 1 1 100%;
                    }

                    .section-4 > div {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default VideoDetail;
