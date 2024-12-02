import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const App = () => {
  const canvasRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const neurons = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      radius: Math.random() * 3 + 2,
      pulsePhase: Math.random() * Math.PI * 2,
      connections: []
    }));

    neurons.forEach(neuron => {
      const nearestNeurons = neurons
        .filter(n => n !== neuron)
        .sort((a, b) => {
          const distA = Math.hypot(a.x - neuron.x, a.y - neuron.y);
          const distB = Math.hypot(b.x - neuron.x, b.y - neuron.y);
          return distA - distB;
        })
        .slice(0, 3);
      neuron.connections = nearestNeurons;
    });

    const animate = () => {
      ctx.fillStyle = 'rgba(20, 20, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      neurons.forEach(neuron => {
        neuron.x += neuron.vx;
        neuron.y += neuron.vy;
        neuron.pulsePhase += 0.02;

        if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1;
        if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1;

        const pulseSize = Math.sin(neuron.pulsePhase) * 0.5 + 1;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.radius * pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(205, 164, 94, 0.6)';
        ctx.fill();

        neuron.connections.forEach(other => {
          const dx = other.x - neuron.x;
          const dy = other.y - neuron.y;
          const distance = Math.hypot(dx, dy);
          
          if (distance < 200) {
            const signal = Math.sin(neuron.pulsePhase - distance / 50) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.moveTo(neuron.x, neuron.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(205, 164, 94, ${0.15 * signal})`;
            ctx.lineWidth = signal * 0.8;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'research', label: 'Research' },
    { id: 'projects', label: 'Projects' },
    { id: 'ideas', label: 'Ideas' },
    { id: 'cv', label: 'CV' }
  ];

  return (
    <div className="min-h-screen bg-[#141414] overflow-hidden relative font-['Manrope']">
      <canvas ref={canvasRef} className="fixed inset-0 z-0"/>
      
      <nav className="fixed top-0 right-0 h-screen z-20">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute top-4 right-4 p-2 bg-[#1c1c1c]/90 backdrop-blur-sm rounded-full shadow-lg text-[#E5DCC5] hover:text-[#CDA45E] transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: isMenuOpen ? '0%' : '100%' }}
          className="h-full w-64 bg-[#1c1c1c]/90 backdrop-blur-sm shadow-lg p-8 pt-20"
        >
          <div className="flex flex-col gap-4">
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="font-['Syncopate'] uppercase text-sm text-[#E5DCC5] hover:text-[#CDA45E] transition-colors tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                {section.label}
              </a>
            ))}
          </div>
        </motion.div>
      </nav>

      <div className="relative z-10">
        <header id="home" className="h-screen flex flex-col justify-center items-center p-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-['Syncopate'] uppercase text-5xl md:text-6xl font-light tracking-wider mb-6 text-[#E5DCC5]"
          >
            Hildelith F. Leyser
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-[#A69F88] tracking-wide font-light"
          >
            Neuroscientist & Neurotech Enthusiast
          </motion.p>
        </header>

        <section id="research" className="min-h-screen p-8 md:p-16 bg-[#1c1c1c]/30">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="font-['Syncopate'] uppercase text-3xl md:text-4xl mb-16 tracking-wide text-[#E5DCC5]"
          >
            Research
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-[#1c1c1c]/80 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-[#2a2a2a]"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-['Syncopate'] uppercase text-xl mb-4 text-[#CDA45E]">Neural Interfaces</h3>
              <p className="text-[#A69F88] font-light">Exploring brain-computer interaction paradigms</p>
            </motion.div>
          </div>
        </section>

        <section id="projects" className="min-h-screen p-8 md:p-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="font-['Syncopate'] uppercase text-3xl md:text-4xl mb-16 tracking-wide text-[#E5DCC5]"
          >
            Projects
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-[#1c1c1c]/80 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-[#2a2a2a]"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-['Syncopate'] uppercase text-xl mb-4 text-[#CDA45E]">Project Title</h3>
              <p className="text-[#A69F88] font-light">Project description goes here</p>
            </motion.div>
          </div>
        </section>

        <section id="ideas" className="min-h-screen p-8 md:p-16 bg-[#1c1c1c]/30">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="font-['Syncopate'] uppercase text-3xl md:text-4xl mb-16 tracking-wide text-[#E5DCC5]"
          >
            Ideas
          </motion.h2>
          <div className="prose prose-invert max-w-none">
            <motion.div
              className="bg-[#1c1c1c]/80 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-[#2a2a2a]"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-['Syncopate'] uppercase text-xl mb-4 text-[#CDA45E]">Thought Leadership</h3>
              <p className="text-[#A69F88] font-light">Ideas and insights content goes here</p>
            </motion.div>
          </div>
        </section>

        <section id="cv" className="min-h-screen p-8 md:p-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="font-['Syncopate'] uppercase text-3xl md:text-4xl mb-16 tracking-wide text-[#E5DCC5]"
          >
            CV
          </motion.h2>
          <div className="max-w-4xl mx-auto bg-[#1c1c1c]/80 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-[#2a2a2a]">
            <div className="space-y-6">
              <div>
                <h3 className="font-['Syncopate'] uppercase text-xl mb-4 text-[#CDA45E]">Education</h3>
                <p className="text-[#A69F88] font-light">Your education details here</p>
              </div>
              <div>
                <h3 className="font-['Syncopate'] uppercase text-xl mb-4 text-[#CDA45E]">Experience</h3>
                <p className="text-[#A69F88] font-light">Your experience details here</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;