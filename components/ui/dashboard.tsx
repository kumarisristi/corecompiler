"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Code2, 
  BookOpen, 
  Play, 
  Trophy, 
  Clock, 
  Users, 
  TrendingUp,
  Star,
  Award,
  Target,
  CheckCircle,
  Calendar,
  BarChart3,
  Zap,
  Rocket
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: "Problems Solved",
      value: "127",
      change: "+12 this week",
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Languages Mastered",
      value: "8",
      change: "+2 this month",
      icon: Code2,
      color: "bg-blue-500"
    },
    {
      title: "Study Hours",
      value: "45.5h",
      change: "+8.5h this week",
      icon: Clock,
      color: "bg-purple-500"
    },
    {
      title: "Current Streak",
      value: "15 days",
      change: "Personal best!",
      icon: Zap,
      color: "bg-orange-500"
    }
  ];

  const recentActivity = [
    {
      type: "problem",
      title: "Solved: Binary Tree Traversal",
      language: "JavaScript",
      time: "2 hours ago",
      difficulty: "Medium"
    },
    {
      type: "course",
      title: "Completed: React Hooks",
      language: "React",
      time: "1 day ago",
      difficulty: ""
    },
    {
      type: "challenge",
      title: "Weekly Challenge: Array Manipulation",
      language: "Python",
      time: "3 days ago",
      difficulty: "Hard"
    }
  ];

  const courses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      progress: 75,
      lessons: 24,
      completed: 18,
      rating: 4.8,
      image: "🟨",
      category: "Web Development"
    },
    {
      id: 2,
      title: "Python for Beginners",
      progress: 60,
      lessons: 32,
      completed: 19,
      rating: 4.9,
      image: "🐍",
      category: "Programming"
    },
    {
      id: 3,
      title: "React Advanced Patterns",
      progress: 40,
      lessons: 18,
      completed: 7,
      rating: 4.7,
      image: "⚛️",
      category: "Frontend"
    },
    {
      id: 4,
      title: "Database Design",
      progress: 85,
      lessons: 15,
      completed: 13,
      rating: 4.6,
      image: "🗄️",
      category: "Database"
    }
  ];

  const achievements = [
    {
      title: "First Program",
      description: "Created your first program",
      icon: Rocket,
      earned: true,
      date: "2024-01-15"
    },
    {
      title: "Problem Solver",
      description: "Solved 100 problems",
      icon: Target,
      earned: true,
      date: "2024-02-20"
    },
    {
      title: "Code Warrior",
      description: "Solved 500 problems",
      icon: Trophy,
      earned: false,
      date: ""
    },
    {
      title: "Polyglot",
      description: "Mastered 5 languages",
      icon: Award,
      earned: false,
      date: ""
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your coding progress and achievements</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/compiler" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Code2 className="h-4 w-4" />
                <span>Open Compiler</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'courses', label: 'My Courses', icon: BookOpen },
                { id: 'achievements', label: 'Achievements', icon: Trophy }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        {activity.type === 'problem' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'course' && <BookOpen className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'challenge' && <Target className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{activity.language}</span>
                          {activity.difficulty && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                                {activity.difficulty}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/compiler" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Code2 className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900">Start Coding</h4>
                      <p className="text-sm text-gray-600">Open the code compiler</p>
                    </div>
                  </Link>
                  
                  <Link href="/learn" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <BookOpen className="h-8 w-8 text-green-600 mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900">Continue Learning</h4>
                      <p className="text-sm text-gray-600">Resume your courses</p>
                    </div>
                  </Link>
                  
                  <Link href="/practice" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <Target className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <h4 className="font-medium text-gray-900">Practice Problems</h4>
                      <p className="text-sm text-gray-600">Solve coding challenges</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
              <Link href="/courses" className="text-blue-600 hover:underline font-medium">
                Browse All Courses
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{course.image}</div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-600">{course.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{course.category}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{course.completed}/{course.lessons} lessons</span>
                      <Link href={`/courses/${course.id}`} className="text-blue-600 hover:underline">
                        Continue
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
              <div className="text-sm text-gray-600">
                {achievements.filter(a => a.earned).length} of {achievements.length} earned
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl border-2 p-6 text-center ${
                    achievement.earned 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    achievement.earned ? 'bg-yellow-100' : 'bg-gray-200'
                  }`}>
                    <achievement.icon className={`h-8 w-8 ${
                      achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <h3 className={`font-semibold mb-2 ${
                    achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </h3>
                  
                  <p className={`text-sm mb-3 ${
                    achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {achievement.earned ? (
                    <div className="text-xs text-yellow-600 font-medium">
                      Earned {achievement.date}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">
                      Keep going!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}