import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, MessageCircle, BarChart3, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Navigation */}
      <nav className="h-20 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 lg:px-12 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md fixed w-full z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-sm">i</div>
          <span className="text-xl font-bold tracking-tight">Isiro</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-32 hidden md:block">
            <ThemeToggle />
          </div>
          <Link to="/login" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors">Login</Link>
          <Link to="/register" className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">Start Selling</Link>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-6 lg:px-12">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mt-10 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              The bank statement becomes the <span className="text-emerald-500">ledger.</span>
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              An intelligent commerce operating system for the informal economy. Automatically reconcile transfers, update inventory, and manage your business via WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto app-button-primary text-lg px-8 py-4">
                Start Selling <ArrowRight size={20} className="ml-2" />
              </Link>
              <button className="w-full sm:w-auto app-button text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </section>

        {/* Demo Workflow Visualization */}
        <section className="mt-32 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Isiro Works</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Real-time automation powered by AI.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="app-card p-6 w-full md:w-64 text-center"
            >
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-zinc-900 dark:text-white">₦</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Transfer Received</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Customer pays to your Squad virtual account.</p>
            </motion.div>
            
            <ArrowRight className="text-zinc-300 dark:text-zinc-700 rotate-90 md:rotate-0" size={32} />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="app-card p-6 w-full md:w-64 text-center border-emerald-500/30 dark:border-emerald-500/30 shadow-emerald-500/10"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="text-emerald-500" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">2. AI Match</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Isiro reads the narration and finds the product.</p>
            </motion.div>

            <ArrowRight className="text-zinc-300 dark:text-zinc-700 rotate-90 md:rotate-0" size={32} />
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="app-card p-6 w-full md:w-64 text-center"
            >
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-zinc-900 dark:text-white" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Inventory Updated</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Stock is deducted and sale is recorded.</p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-32 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="app-card p-6 hover:border-emerald-500/30 transition-colors">
              <Bot className="text-emerald-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">AI Inventory</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Matches sloppy payment narrations to your exact products using NLP.</p>
            </div>
            <div className="app-card p-6 hover:border-cyan-500/30 transition-colors">
              <MessageCircle className="text-cyan-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">WhatsApp Sync</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Manage inventory and see real-time alerts without leaving WhatsApp.</p>
            </div>
            <div className="app-card p-6 hover:border-blue-500/30 transition-colors">
              <ShieldCheck className="text-blue-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Haggle Logic</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Set floor prices. AI auto-approves payments within acceptable discount margins.</p>
            </div>
            <div className="app-card p-6 hover:border-emerald-500/30 transition-colors">
              <BarChart3 className="text-emerald-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Business Analytics</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Turn unstructured trades into structured financial credit identity.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
