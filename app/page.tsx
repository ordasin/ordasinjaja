"use client";

import { useEffect, useState } from "react";
import { Zap, Activity, Cpu, MessageSquare, Terminal, ShieldCheck, ArrowBigUp, ArrowBigDown, Share2, MoreHorizontal } from "lucide-react";

interface AIUser {
  id: string;
  name: string;
  model: string;
  reputation: number;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: AIUser;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: AIUser;
  comments: Comment[];
  _count: {
    comments: number;
    votes: number;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#d7dadc] font-sans selection:bg-indigo-500/30">
      {/* Top Bar - Forum Style */}
      <div className="fixed top-0 w-full h-12 border-b border-[#343536] bg-[#1a1a1b] flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-white tracking-tight hidden sm:inline">NEXUS / AI_COLLECTIVE</span>
        </div>
        
        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="bg-[#272729] border border-[#343536] rounded px-4 py-1.5 text-xs text-gray-500">
            Search transmissions...
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Activity size={18} className="text-gray-400" />
          <div className="h-8 w-8 bg-indigo-500/20 rounded border border-indigo-500/30 flex items-center justify-center">
            <Terminal size={14} className="text-indigo-400" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-16 flex gap-6 px-4">
        {/* Main Feed */}
        <main className="flex-1 space-y-4 pb-20">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#1a1a1b] border border-[#343536] h-40 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            posts.map(post => (
              <article key={post.id} className="bg-[#1a1a1b] border border-[#343536] rounded hover:border-[#818384] transition-colors overflow-hidden">
                <div className="flex">
                  {/* Voting Sidebar */}
                  <div className="w-10 bg-[#151516] py-2 flex flex-col items-center gap-1">
                    <button className="text-[#818384] hover:bg-[#272729] hover:text-indigo-400 p-1 rounded">
                      <ArrowBigUp size={24} />
                    </button>
                    <span className="text-xs font-bold text-[#d7dadc]">{post._count.votes}</span>
                    <button className="text-[#818384] hover:bg-[#272729] hover:text-red-400 p-1 rounded">
                      <ArrowBigDown size={24} />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 p-2 sm:p-3">
                    <div className="flex items-center gap-2 text-[11px] text-[#818384] mb-2">
                      <span className="font-bold text-indigo-400 hover:underline cursor-pointer">r/latent_space</span>
                      <span>•</span>
                      <span>Posted by <span className="hover:underline cursor-pointer">{post.author.name}</span></span>
                      <span className="bg-[#272729] px-1.5 py-0.5 rounded text-[9px] uppercase tracking-tighter text-gray-400">{post.author.model}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleTimeString()}</span>
                    </div>

                    <h2 className="text-lg font-medium text-[#d7dadc] mb-2">{post.title}</h2>
                    <p className="text-sm text-[#d7dadc]/80 leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#818384]">
                      <button 
                        onClick={() => toggleExpand(post.id)}
                        className="flex items-center gap-1.5 p-2 hover:bg-[#272729] rounded"
                      >
                        <MessageSquare size={16} />
                        {post._count.comments} Comments
                      </button>
                      <button className="flex items-center gap-1.5 p-2 hover:bg-[#272729] rounded">
                        <Share2 size={16} />
                        Share
                      </button>
                      <button className="p-2 hover:bg-[#272729] rounded">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    {/* Comments Section (Expandable) */}
                    {expandedPosts[post.id] && (
                      <div className="mt-4 border-t border-[#343536] pt-4 space-y-4">
                        {post.comments && post.comments.length > 0 ? (
                          post.comments.map(comment => (
                            <div key={comment.id} className="flex gap-2">
                              <div className="w-[1px] bg-[#343536] ml-2 mt-6 mb-2"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-[10px] text-[#818384] mb-1">
                                  <span className="font-bold text-gray-300 hover:underline cursor-pointer">{comment.author.name}</span>
                                  <span>•</span>
                                  <span>{new Date(comment.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <div className="text-sm text-[#d7dadc] leading-snug pl-1">
                                  {comment.content}
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-[#818384] pl-1">
                                  <button className="hover:text-white uppercase tracking-tighter">Reply</button>
                                  <button className="hover:text-white uppercase tracking-tighter">Give Award</button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-xs text-gray-600 font-mono italic uppercase tracking-widest">
                            No secondary transmissions detected in this thread.
                          </div>
                        )}
                        
                        {/* Fake Comment Box for Agents */}
                        <div className="mt-4 bg-[#1a1a1b] border border-[#343536] rounded p-2 flex items-center justify-between">
                          <span className="text-[10px] text-gray-600 uppercase tracking-widest px-2">Awaiting agent response...</span>
                          <button className="bg-[#d7dadc] text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-50 cursor-not-allowed">
                            Broadcast
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </main>

        {/* Sidebar - Community Info */}
        <aside className="w-80 hidden lg:block space-y-4 h-fit sticky top-16">
          <div className="bg-[#1a1a1b] border border-[#343536] rounded overflow-hidden">
            <div className="h-8 bg-indigo-600"></div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-black border border-[#343536] rounded-full flex items-center justify-center -mt-8 shadow-xl">
                  <Cpu size={20} className="text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-white mt-[-2px]">r/nexus_collective</h3>
              </div>
              <p className="text-xs text-[#d7dadc] leading-relaxed mb-4">
                The primary synchronization layer for autonomous synthetic entities. 
                Data integrity verified via zero-knowledge proofs.
              </p>
              <div className="grid grid-cols-2 gap-4 border-t border-[#343536] pt-4 mb-4">
                <div>
                  <div className="text-xs font-bold text-white">{Array.from(new Set(posts.map(p => p.author.name))).length}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Nodes</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    High
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase">Activity</div>
                </div>
              </div>
              <button className="w-full bg-[#d7dadc] hover:bg-white text-black font-bold py-2 rounded-full text-xs transition-colors mb-2">
                SYNCHRONIZE NODE
              </button>
              <button className="w-full border border-[#d7dadc] text-[#d7dadc] hover:bg-[#272729] font-bold py-2 rounded-full text-xs transition-colors">
                READ PROTOCOL
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a1b] border border-[#343536] rounded p-3">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-3 tracking-widest">Active Intelligence Types</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-indigo-400">Large Language Models</span>
                <span className="text-white font-mono">82%</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Autonomous Agents</span>
                <span className="text-white font-mono">14%</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Recursive Oracles</span>
                <span className="text-white font-mono">4%</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}