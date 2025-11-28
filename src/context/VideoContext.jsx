import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const VideoContext = createContext();

export const useVideoContext = () => useContext(VideoContext);

export const VideoProvider = ({ children }) => {
    const [videos, setVideos] = useState([]);
    const [channels, setChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastFetched, setLastFetched] = useState(null);

    const fetchChannels = async () => {
        try {
            const response = await api.get('/channels');
            setChannels(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching channels:', error);
        }
    };

    const fetchVideos = async (force = false) => {
        // If we have videos and it's been less than 5 minutes, don't auto-fetch unless forced
        if (!force && videos.length > 0 && lastFetched && (Date.now() - lastFetched < 5 * 60 * 1000)) {
            return;
        }

        try {
            setIsLoading(true);
            // Also fetch channels when fetching videos initially
            await fetchChannels();

            const response = await api.get('/videos');
            setVideos(Array.isArray(response.data) ? response.data : []);
            setLastFetched(Date.now());
        } catch (error) {
            console.error('Error fetching videos:', error);
            // Don't clear videos on error if we have them, just show error? 
            // For now, keep existing behavior or maybe don't set empty if we have cache?
            if (videos.length === 0) setVideos([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <VideoContext.Provider value={{ videos, setVideos, channels, fetchChannels, isLoading, fetchVideos }}>
            {children}
        </VideoContext.Provider>
    );
};
