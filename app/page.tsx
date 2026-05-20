'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import MotionButton from '@/components/motion-button';



export default function Home() {
  const [userName, setUserName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    if (!userName.trim()) return;
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('poker_userName', userName);
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!userName.trim() || !roomCode.trim()) return;
    localStorage.setItem('poker_userName', userName);
    router.push(`/room/${roomCode.toUpperCase()}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 min-h-screen flex items-center">
      <div className="grid lg:grid-cols-2 gap-20 items-center w-full justify-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='md:text-start md:item-center md:flex-col'
          >
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-500/10 border border-neutral-500/20 rounded-full text-neutral-400 text-sm font-medium mb-8">
              <Rocket size={14} />
              <span>Agile </span>
            </div> */}
            <span className="text-sm font-medium tracking-wide uppercase text-neutral-500 mb-10">
              Built by{' '}
              <a
                href="https://mickie2k.com"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-200 hover:text-white transition-colors"
              >
                mickie2k
              </a>
            </span>
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-100 to-pink-50">
              Skrum
            </h1>
            <p className="text-lg text-neutral-500 leading-relaxed mb-10 max-w-md">
              Real-time scrum poker for agile teams.
              Estimate issues together with a crisp interface built for speed, clarity, and trust.
            </p>

            <div className="space-y-6 max-w-md bg-transparent p-1 rounded-3xl relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-150" />
                <input
                  type="text"
                  placeholder="Enter your name to start..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="relative w-full  h-14 px-6 rounded-full border border-white/10 bg-white/5 text-white focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none transition-all placeholder:text-neutral-500 text-lg font-semibold shadow-inner"
                />
              </div>

              <div className="flex flex-col gap-4">
                <MotionButton
                  onClick={handleCreateRoom}
                  disabled={!userName.trim()}
                  label="Create New Room"
                  classes="w-full"
                />

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0a0a0a] px-4 py-1 rounded-full tracking-wide text-neutral-500 font-bold border border-white/5 shadow-sm">Or join existing</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="relative flex-1 h-14 px-6 rounded-full border border-white/10 bg-white/5 text-white focus:bg-white/10 focus:ring-1 focus:ring-white/20 outline-none transition-all placeholder:text-neutral-500 font-medium shadow-inner"
                  />
                  <button
                    onClick={handleJoinRoom}
                    disabled={!userName.trim() || !roomCode.trim()}
                    className="h-14 px-8 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white text-lg hover:text-black transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative h-full hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 p-2 rounded-[2.5rem] h-full shadow-2xl border border-white/10"
          >
            <div className="bg-[#0c0c0c] p-8 rounded-[2rem] h-full flex items-center justify-center relative overflow-hidden">
              {/* Illustration of Poker Interface */}
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3, 5, 8, '?'].map((v, i) => (
                  <motion.div
                    key={v}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="w-20 h-32 bg-gradient-to-br from-white to-neutral-200 rounded-xl shadow-2xl p-0.5 flex items-center justify-center"
                  >
                    <span className="font-number flex h-full w-full items-center justify-center  text-zinc-800 text-4xl font-bold shadow-inner">
                      {v}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-1/5 left-6 right-6 flex justify-between items-center bg-[#121212]/80 backdrop-blur px-4 py-3 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-neutral-600 border-2 border-[#121212] flex items-center justify-center text-[10px] font-bold text-white">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-neutral-200"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-neutral-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-pink-500/10 blur-3xl rounded-full" />
        </div>
      </div>

      {/* <section className="mt-32 grid md:grid-cols-3 gap-12">
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 bg-neutral-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-neutral-500/20">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Real-Time Sync</h3>
          <p className="text-neutral-400">Every vote and reveal is instantly synchronized across the whole team.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Gamepad2 size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Interactive Deck</h3>
          <p className="text-neutral-400">A familiar Fibonacci sequence deck that makes estimating intuitive and fun.</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 border border-orange-500/20">
            <Layout size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Responsive Design</h3>
          <p className="text-neutral-400">Works perfectly on laptops, tablets, and phones. Vote from anywhere.</p>
        </div>
      </section> */}
      {/* <section className="mt-32 flex flex-row justify-center gap-12">
        <div className="flex flex-col gap-4">

          <p className="text-neutral-400">Works perfectly on laptops, tablets, and phones. Vote from anywhere.</p>
        </div>
      </section> */}

    </main>
  );
}


