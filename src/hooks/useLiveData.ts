/**
 * useLiveData Hook
 * 
 * Provides simulated real-time data updates for the dashboard.
 * In a production app, this would connect to a WebSocket or polling API.
 */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

// Types for live data
export interface LiveStats {
  totalProjects: number;
  activeUsers: number;
  revenue: number;
  tasksCompleted: number;
  lastUpdated: Date;
}

export interface LiveActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
}

export interface ToolStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'loading';
  lastPing: Date | null;
  url: string;
}

// Tool configuration
const TOOLS: Omit<ToolStatus, 'status' | 'lastPing'>[] = [
  { id: 'code-editor', name: 'Code Editor', url: 'https://eed972db.aurion-ide.pages.dev' },
  { id: 'app-builder', name: 'App Builder', url: 'https://production.ai-assistant-xlv.pages.dev' },
  { id: 'agent-ai', name: 'Agent AI', url: 'https://flo-9xh2.onrender.com/' },
  { id: 'aurion-chat', name: 'Aurion Chat', url: 'https://canvchat-1-y73q.onrender.com/' },
  { id: 'intelligent-canvas', name: 'Intelligent Canvas', url: 'https://tersa-main-b5f0ey7pq-launchmateais-projects.vercel.app/canvas/' },
  { id: 'text-editor', name: 'Text Editor', url: 'https://4e2af144.aieditor.pages.dev' },
];

// Generate random activity
const generateRandomActivity = (): LiveActivity => {
  const users = ['Marie L.', 'Thomas R.', 'Sophie M.', 'Lucas P.', 'Emma D.', 'Hugo B.'];
  const actions = ['completed task', 'commented on', 'uploaded file to', 'created project', 'updated', 'reviewed'];
  const targets = ['Homepage Design', 'API Integration', 'Brand Assets', 'Mobile App v2', 'Dashboard UI', 'User Authentication'];
  
  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    user: users[Math.floor(Math.random() * users.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    target: targets[Math.floor(Math.random() * targets.length)],
    timestamp: new Date(),
  };
};

// Format relative time
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  
  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

/**
 * Hook for live statistics data
 */
export function useLiveStats(updateInterval = 30000) {
  const [stats, setStats] = useState<LiveStats>({
    totalProjects: 24,
    activeUsers: 1429,
    revenue: 48200,
    tasksCompleted: 89,
    lastUpdated: new Date(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalProjects: prev.totalProjects + (Math.random() > 0.7 ? 1 : 0),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 3,
        revenue: prev.revenue + Math.floor(Math.random() * 500),
        tasksCompleted: Math.min(100, Math.max(0, prev.tasksCompleted + (Math.random() > 0.5 ? 1 : -1))),
        lastUpdated: new Date(),
      }));
      logger.debug('Live stats updated');
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return stats;
}

/**
 * Hook for live activity feed
 */
export function useLiveActivity(maxItems = 10, addInterval = 45000) {
  const [activities, setActivities] = useState<LiveActivity[]>(() => {
    // Initialize with some activities
    const initial: LiveActivity[] = [];
    const now = new Date();
    const times = [2, 15, 60, 180]; // minutes ago
    
    times.forEach((minAgo, index) => {
      const activity = generateRandomActivity();
      activity.timestamp = new Date(now.getTime() - minAgo * 60 * 1000);
      activity.id = `initial-${index}`;
      initial.push(activity);
    });
    
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = generateRandomActivity();
        const updated = [newActivity, ...prev].slice(0, maxItems);
        logger.debug('New activity added', { user: newActivity.user, action: newActivity.action });
        return updated;
      });
    }, addInterval);

    return () => clearInterval(interval);
  }, [maxItems, addInterval]);

  return activities;
}

/**
 * Hook for tool status monitoring
 */
export function useToolStatus() {
  const [tools, setTools] = useState<ToolStatus[]>(() => 
    TOOLS.map(tool => ({
      ...tool,
      status: 'loading' as const,
      lastPing: null,
    }))
  );

  // Check tool availability
  // NOTE: SIMULATION MODE - In production, replace this with a backend API endpoint
  // that can properly check if external services are reachable.
  // Example production implementation:
  //   const response = await fetch('/api/health-check', { body: JSON.stringify({ url: tool.url }) });
  //   return response.json();
  const checkToolStatus = useCallback(async (tool: ToolStatus) => {
    try {
      // Simulated delay (production: actual health check)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      return {
        ...tool,
        status: 'online' as const,
        lastPing: new Date(),
      };
    } catch {
      return {
        ...tool,
        status: 'offline' as const,
        lastPing: new Date(),
      };
    }
  }, []);

  // Initial status check
  useEffect(() => {
    const checkAll = async () => {
      const results = await Promise.all(
        tools.map(tool => checkToolStatus(tool))
      );
      setTools(results);
      logger.info('Tool status check completed', { 
        online: results.filter(t => t.status === 'online').length,
        total: results.length 
      });
    };

    checkAll();
    
    // Re-check every 2 minutes
    const interval = setInterval(checkAll, 120000);
    return () => clearInterval(interval);
  }, [checkToolStatus]);

  return tools;
}

/**
 * Hook for current time (updates every second)
 */
export function useCurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}

export default {
  useLiveStats,
  useLiveActivity,
  useToolStatus,
  useCurrentTime,
  formatRelativeTime,
};
