// src/app/page.tsx - COMBINED BUSINESS + EDUCATION PLATFORM
import Link from 'next/link';
import { 
  Code, 
  Palette, 
  Video, 
  Rocket, 
  BookOpen, 
  Upload, 
  Award, 
  Users,
  CheckCircle, 
  Star,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Mail,
  Phone} from 'lucide-react';

export default function HomePage() {
  const businessServices = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom websites and web applications built with Next.js, React, and modern technologies',
      gradient: 'from-blue-600 to-cyan-600',
      features: ['Responsive Design', 'Fast Performance', 'SEO Optimized', 'Secure & Scalable'],
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive interfaces that engage users and drive conversions',
      gradient: 'from-purple-600 to-pink-600',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Brand Identity'],
    },
    {
      icon: Video,
      title: 'Content Creation',
      description: 'Professional video editing, motion graphics, and multimedia content',
      gradient: 'from-green-600 to-emerald-600',
      features: ['Video Editing', 'Motion Graphics', 'Color Grading', 'Audio Mixing'],
    },
  ];

  const platformFeatures = [
    {
      icon: BookOpen,
      title: 'Study Materials',
      description: 'Access thousands of notes, question papers, and study resources',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/materials',
    },
    {
      icon: Upload,
      title: 'Share Knowledge',
      description: 'Upload your notes and help fellow students succeed',
      gradient: 'from-purple-500 to-pink-500',
      link: '/upload',
    },
    {
      icon: Award,
      title: 'Practice Quizzes',
      description: 'Test your knowledge with interactive quizzes',
      gradient: 'from-green-500 to-emerald-500',
      link: '/quizzes',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join thousands of students helping each other learn',
      gradient: 'from-yellow-500 to-orange-500',
      link: '/community',
    },
  ];

  const stats = [
    { label: 'Projects Completed', value: '150+', icon: CheckCircle, color: 'text-blue-600' },
    { label: 'Happy Clients', value: '100+', icon: Users, color: 'text-purple-600' },
    { label: 'Study Materials', value: '5,000+', icon: BookOpen, color: 'text-green-600' },
    { label: 'Active Students', value: '10,000+', icon: Star, color: 'text-yellow-600' },
  ];

  const technologies = [
    { name: 'Next.js', icon: '⚡', color: 'from-black to-gray-800' },
    { name: 'React', icon: '⚛️', color: 'from-cyan-500 to-blue-500' },
    { name: 'TypeScript', icon: '📘', color: 'from-blue-600 to-indigo-600' },
    { name: 'Tailwind CSS', icon: '🎨', color: 'from-teal-500 to-cyan-500' },
    { name: 'Firebase', icon: '🔥', color: 'from-yellow-500 to-orange-500' },
    { name: 'Node.js', icon: '🟢', color: 'from-green-600 to-emerald-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Combined */}
      <section className="relative bg-gradient-primary-animated text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 animate-fade-in">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">Web Developer • Content Creator • Educator</span>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6 animate-slide-up">
              <Sparkles className="w-12 h-12 md:w-16 md:h-16 animate-bounce" />
              <h1 className="text-5xl md:text-7xl font-bold">
                ThrillyVerse
              </h1>
              <Sparkles className="w-12 h-12 md:w-16 md:h-16 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>

            <p className="text-2xl md:text-4xl font-bold mb-4 animate-slide-up animate-delay-100">
              Web Development • Content Creation • Education
            </p>

            <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-4xl mx-auto animate-slide-up animate-delay-200">
              Professional web development services + Learning platform for students
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-scale-in animate-delay-300">
              <Link 
                href="/contact" 
                className="btn bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-10 py-5 shadow-2xl hover-lift"
              >
                <MessageSquare className="w-5 h-5" />
                Hire Me for Projects
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/materials" 
                className="btn glass text-white hover:bg-white hover:bg-opacity-20 text-lg px-10 py-5 border-2 border-white hover-lift"
              >
                <BookOpen className="w-5 h-5" />
                Browse Study Materials
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in animate-delay-400">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white bg-opacity-20 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-indigo-200 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Business Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">Professional Services</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-2">
              What I <span className="text-gradient">Offer</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive digital solutions for your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {businessServices.map((service, index) => (
              <div
                key={service.title}
                className={`card-interactive p-8 relative overflow-hidden group animate-scale-in animate-delay-${(index + 1) * 100}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gradient-static transition-all">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-2">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact" className="btn btn-primary text-lg px-10 py-4">
              <Mail className="w-5 h-5" />
              Get a Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Platform Features */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wide">Learning Platform</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-2">
              Study & <span className="text-gradient">Learn Together</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access free study materials and join our student community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <Link
                key={feature.title}
                href={feature.link}
                className={`card-interactive p-8 text-center group animate-scale-in animate-delay-${(index + 1) * 100}`}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gradient-static transition-all">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-4 flex items-center justify-center gap-1 text-indigo-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore now
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technologies I Work With
            </h2>
            <p className="text-lg text-gray-600">
              Modern tools and frameworks for cutting-edge solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <div
                key={tech.name}
                className={`card-interactive p-6 text-center group animate-scale-in animate-delay-${(index + 1) * 50}`}
              >
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">
                  {tech.icon}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="py-24 bg-gradient-primary-animated text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Business CTA */}
            <div className="text-center md:text-left animate-slide-in-left">
              <Rocket className="w-16 h-16 mb-6 mx-auto md:mx-0 animate-bounce" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Need a Website or App?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Let&apos;s build something amazing together
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact" 
                  className="btn bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 shadow-2xl hover-lift"
                >
                  <Mail className="w-5 h-5" />
                  Contact Me
                </Link>
                <a 
                  href="tel:+1234567890" 
                  className="btn glass hover:bg-white hover:bg-opacity-20 px-8 py-4 border-2 border-white"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </div>

            {/* Platform CTA */}
            <div className="text-center md:text-left animate-slide-in-right">
              <Award className="w-16 h-16 mb-6 mx-auto md:mx-0 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Join thousands of students and access free resources
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup" 
                  className="btn bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 shadow-2xl hover-lift"
                >
                  <Users className="w-5 h-5" />
                  Join Free
                </Link>
                <Link 
                  href="/materials" 
                  className="btn glass hover:bg-white hover:bg-opacity-20 px-8 py-4 border-2 border-white"
                >
                  <BookOpen className="w-5 h-5" />
                  Browse Materials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}