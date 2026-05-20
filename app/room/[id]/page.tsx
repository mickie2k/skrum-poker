'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/hooks/use-socket';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Coffee, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const CARDS = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕'];

interface Participant {
  id: string;
  name: string;
  vote: string | null;
}

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = use(params);
  const router = useRouter();
  const { socket, connected } = useSocket();
  const [userName, setUserName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [showInviteToast, setShowInviteToast] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('poker_userName');
    if (!storedName) {
      const name = prompt('Please enter your name to join the room:');
      if (name) {
        localStorage.setItem('poker_userName', name);
        queueMicrotask(() => setUserName(name));
      } else {
        router.push('/');
      }
    } else {
      queueMicrotask(() => setUserName(storedName));
    }
  }, [router]);

  useEffect(() => {
    if (socket && connected && userName) {
      socket.emit('join-room', { roomId, userName });

      socket.on('room-update', ({ participants, revealed }) => {
        setParticipants(participants);
        setRevealed(revealed);
      });

      return () => {
        socket.off('room-update');
      };
    }
  }, [socket, connected, roomId, userName]);

  const handleVote = (vote: string) => {
    const newVote = myVote === vote ? null : vote;
    setMyVote(newVote);
    socket?.emit('vote', { roomId, vote: newVote });
  };

  const handleReveal = () => {
    socket?.emit('reveal', { roomId });
  };

  const handleReset = () => {
    setMyVote(null);
    socket?.emit('reset', { roomId });
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowInviteToast(true);
    setTimeout(() => setShowInviteToast(false), 2000);
  };

  const calculateAverage = () => {
    const numericVotes = participants
      .map((p) => parseFloat(p.vote || ''))
      .filter((v) => !isNaN(v));
    if (numericVotes.length === 0) return 0;
    return (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1);
  };

  if (!userName) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col text-neutral-200">
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-[#0c0c0c] px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-neutral-300"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-black shadow-lg">{roomId.charAt(0).toUpperCase()}</div>
            <span className="font-semibold tracking-tight text-neutral-200">Room <span className="text-neutral-500 mx-1">/</span> <span className="text-neutral-200">{roomId}</span></span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={handleCopyInvite}
            className="cursor-pointer text-sm font-medium text-neutral-300 border border-white/10 px-3 py-1.5 rounded hover:bg-white/5 transition-colors"
          >
            Share Room
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Member</span>
              <span className="text-sm font-bold text-neutral-300">{userName}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {userName[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col-reverse lg:flex-row overflow-hidden">
        {/* Left: Participants Sidebar */}
        <aside className="lg:w-[320px] bg-[#0c0c0c] border-t lg:border-t-0 lg:border-r border-white/10 flex flex-col p-6 overflow-hidden md:h-auto lg:h-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-neutral-200 px-1.5 py-0.5 bg-white/10 rounded uppercase">Active Session</span>
              {/* <span className="text-xs text-neutral-300 uppercase tracking-widest">Planning</span> */}
            </div>
            <h1 className="text-2xl font-bold leading-tight text-white">Issue Estimation</h1>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xs text-neutral-300 uppercase tracking-widest mb-4 flex justify-between">
              <span>Team Members</span>
              <span>{participants.length} online</span>
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <AnimatePresence initial={false}>
                {participants.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
                        p.vote ? "bg-white text-black border-white/40" : "bg-neutral-700 border-white/5 text-neutral-300"
                      )}>
                        {p.name[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-neutral-100">{p.name} {p.id === socket?.id && "(You)"}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {p.vote ? (
                        revealed ? (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-6 h-6 flex items-center justify-center bg-white text-black text-xs font-bold rounded shadow-lg"
                          >
                            {p.vote === '☕' ? <Coffee size={12} /> : p.vote}
                          </motion.div>

                        ) : (
                          <div className="w-6 h-6 bg-white/5 border border-white/20 rounded flex items-center justify-center">
                            <svg className="w-3 h-3 text-white/70" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                          </div>
                        )
                      ) : (
                        <div className="w-6 h-6 bg-[#1a1a1a] border border-dashed border-white/10 rounded flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full border-1 border-white/20 animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </aside>

        {/* Right: Main Content Area */}
        <section className="flex-1 flex flex-col bg-[#0a0a0a] relative">
          <div className="flex-1 flex items-start justify-center p-12 overflow-hidden">
            <div className="flex flex-col items-center gap-8">
              {/* Virtual Poker Circle */}
              <div className="relative group w-full">
                <div className="flex flex-wrap items-center justify-center gap-4 rounded-full px-6 py-3 mb-12 shadow-2xl mx-auto w-fit">
                  <div className="flex items-center gap-2">
                    {/* <CheckCircle2 size={16} className="text-neutral-200" /> */}
                    <span className="text-2xl font-display  text-neutral-400 ">Result</span>
                  </div>
                  <div className="text-2xl text-white min-w-[48px] font-number text-center">
                    {revealed ? calculateAverage() : '--'}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-12 relative z-10">
                  {participants.map((p, idx) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <AnimatePresence mode="wait">
                        {!p.vote ? (
                          <motion.div
                            key="waiting"
                            className="w-20 h-32 bg-[#1a1a1a] border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center opacity-40"
                            transition={{ duration: 0.12, ease: 'easeOut' }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            <div className="w-4 h-4 rounded-full border-2 border-white/20 animate-pulse"></div>
                          </motion.div>
                        ) : revealed ? (
                          <motion.div
                            key="revealed"
                            initial={{ rotateY: 180, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            transition={{ duration: 0.16, ease: 'easeOut' }}
                            className="w-20 h-32 bg-gradient-to-br from-white to-neutral-200 rounded-lg flex items-center justify-center text-2xl font-bold shadow-2xl border border-white/20 text-zinc-900 font-number"
                          >
                            {p.vote === '☕' ? <Coffee size={24} /> : p.vote}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="hidden"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.14, ease: 'easeOut' }}
                            className="w-20 h-32 bg-white/5 border-2 border-white/20 rounded-lg flex items-center justify-center shadow-inner"
                          >
                            <div className="w-6 h-8 rounded-sm flex items-center justify-center">
                              <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        p.vote ? "text-neutral-300" : "text-neutral-500"
                      )}>
                        {p.name.split(' ')[0]}
                      </span>
                    </motion.div>
                  ))}
                </div>

              </div>

            </div>
          </div>

          {/* Controls Footer */}
          <div className="min-h-[11rem] h-auto border-t border-white/5 bg-[#0c0c0c] flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-0 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              {!revealed ? (
                <button
                  onClick={handleReveal}
                  disabled={participants.filter(p => p.vote).length === 0}
                  className="px-8 md:px-10 py-3 md:py-3.5 cursor-pointer bg-white border border-white/10 text-black uppercase text-sm md:text-base rounded-full hover:bg-neutral-100 hover:text-black hover:scale-105 active:scale-95 transition-all disabled:bg-neutral-800 disabled:border-white/5 disabled:text-neutral-700 disabled:pointer-events-none shadow-2xl font-display font-normal tracking-widest whitespace-nowrap"
                >
                  Reveal Round
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-8 md:px-10 py-3 md:py-3.5 bg-white border border-white/10 cursor-pointer text-black font-normal uppercase text-sm md:text-base rounded-full hover:bg-neutral-100 hover:text-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xl font-display tracking-widest whitespace-nowrap"
                >
                  <RotateCcw size={16} />
                  Start new voting
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center max-w-4xl pt-2 md:pt-4">
              {CARDS.map((card) => (
                <button
                  key={card}
                  onClick={() => handleVote(card)}
                  className={cn(
                    "card-poker !w-10 !h-14 md:!w-12 md:!h-16 text-base md:text-lg",
                    "font-number",
                    myVote === card && "active"
                  )}
                >
                  {card === '☕' ? <Coffee size={myVote === card ? 20 : 18} /> : card}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[10px] md:text-xs text-neutral-400 uppercase tracking-[0.2em] md:tracking-[0.25em] font-bold">Select Your Estimate</p>
          </div>
        </section>
      </main>

      {/* Toasts */}
      <AnimatePresence>
        {showInviteToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-12 md:bottom-48 right-4 md:right-8 bg-[#0c0c0c] border border-white/10 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-base font-medium">Link copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
