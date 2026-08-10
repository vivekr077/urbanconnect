'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/common/Container';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SectionTitle } from '@/components/common/SectionTitle';
import { SPORTS } from '@/constants/sports';
import {
  MapPin,
  Trophy,
  Users,
  Shield,
  Compass,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 dark:from-emerald-950/10 dark:to-blue-950/10">
          <Container className="relative">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-pulse">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Connecting Local Communities</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-100 dark:to-slate-300">
                Find nearby players, activities, and communities in minutes
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                UrbanConnect matches you with local sports games, runs, fitness classes, and rideshares based on your specific location and skill level.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-emerald-500/20 group">
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Activities
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Sports Categories Section */}
        <section id="sports" className="py-16 md:py-20 border-y border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/10">
          <Container>
            <SectionTitle
              title="Supported Sports & Activities"
              subtitle="Find active match ups, practices, and meetups in your favorite disciplines."
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {SPORTS.map((sport) => (
                <div
                  key={sport.id}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{sport.icon}</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{sport.name}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Nearby Activities Capabilities */}
        <section id="features" className="py-20 md:py-24">
          <Container>
            <SectionTitle
              title="Built for Active Lifestyles"
              subtitle="UrbanConnect brings together local organizers, participants, and players into a unified real-time ecosystem."
            />

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="hover:translate-y-[-6px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8 flex flex-col space-y-4">
                  <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">📍 Nearby Discovery</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Uses PostGIS distance calculation to find and list local activities exactly within your preferred radius.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="hover:translate-y-[-6px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8 flex flex-col space-y-4">
                  <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">🎯 Skill Matching</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Matches players based on activity skill level settings to keep games competitive, fair, and fun for everyone.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="hover:translate-y-[-6px] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8 flex flex-col space-y-4">
                  <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">🛡️ Secure Invitations</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Complete invitation lifecycle with transactional safety guarantees, capacity caps, and soft-cancellation logs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-24 bg-slate-50/50 dark:bg-slate-900/10 border-t border-slate-200/50 dark:border-slate-800/50">
          <Container>
            <SectionTitle
              title="How UrbanConnect Works"
              subtitle="Join local activities or coordinate your own in just four easy steps."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-3 relative group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white text-xl font-extrabold shadow-lg shadow-emerald-500/20">
                  1
                </div>
                <h4 className="text-lg font-bold">Create Account</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[200px]">
                  Sign up with email and secure password verification.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-3 relative group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white text-xl font-extrabold shadow-lg shadow-emerald-500/20">
                  2
                </div>
                <h4 className="text-lg font-bold">Build Profile</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[200px]">
                  Select your home city, sports preferences, and skill levels.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-3 relative group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white text-xl font-extrabold shadow-lg shadow-emerald-500/20">
                  3
                </div>
                <h4 className="text-lg font-bold">Discover & Join</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[200px]">
                  Find games or runs nearby and send request-to-join permissions.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center space-y-3 relative group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white text-xl font-extrabold shadow-lg shadow-emerald-500/20">
                  4
                </div>
                <h4 className="text-lg font-bold">Play & Rate</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[200px]">
                  Show up to the game, meet people, and increase your trust score.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 md:py-24">
          <Container>
            <SectionTitle
              title="What Players Are Saying"
              subtitle="Discover how local residents use UrbanConnect to rebuild active community connections."
            />

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-slate-50/50 dark:bg-slate-900/10">
                <CardContent className="p-8 flex flex-col space-y-4">
                  <div className="flex space-x-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-slate-600 dark:text-slate-350 italic text-sm leading-relaxed">
                    "Moving to a new city made it hard to find a regular soccer group. UrbanConnect matched me with a league playing 5 minutes from my house within three days!"
                  </p>
                  <div className="flex items-center space-x-3 pt-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                      JD
                    </div>
                    <div>
                      <h5 className="font-bold text-sm">John Doe</h5>
                      <span className="text-slate-400 text-xs">Soccer enthusiast, Madrid</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50/50 dark:bg-slate-900/10">
                <CardContent className="p-8 flex flex-col space-y-4">
                  <div className="flex space-x-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-slate-600 dark:text-slate-350 italic text-sm leading-relaxed">
                    "I organize weekend morning runs. The participant approvals and invitation features help me keep track of numbers so that we never overflow the trail capacity."
                  </p>
                  <div className="flex items-center space-x-3 pt-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                      AS
                    </div>
                    <div>
                      <h5 className="font-bold text-sm">Alice Smith</h5>
                      <span className="text-slate-400 text-xs">Running club organizer, London</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <Container className="relative">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-extrabold sm:text-5xl">
                Ready to find your community?
              </h2>
              <p className="text-lg text-emerald-100 max-w-xl mx-auto leading-relaxed">
                Join thousands of urban residents who are already organizing, discovering, and participating in sports nearby.
              </p>
              <div className="pt-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white hover:bg-slate-100 text-emerald-700 shadow-xl border-white hover:border-slate-100">
                    Create Your Account Today
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
