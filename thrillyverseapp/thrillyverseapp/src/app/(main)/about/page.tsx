// src/app/(main)/about/page.tsx - ABOUT PAGE
'use client';

import { 
  Code, 
  Palette, 
  Video, 
  Calendar,
  Heart,
  Target,
  Zap,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Coffee,
  Rocket
} from 'lucide-react';

export default function AboutPage() {
  const skills = [
    { name: 'Next.js', level: 95, icon: '⚡' },
    { name: 'React', level: 95, icon: '⚛️' },
    { name: 'TypeScript', level: 90, icon: '📘' },
    { name: 'Tailwind CSS', level: 95, icon: '🎨' },
    { name: 'Firebase', level: 85, icon: '🔥' },
    { name: 'Node.js', level: 85, icon: '🟢' },
    { name: 'UI/UX Design', level: 90, icon: '✨' },
    { name: 'Video Editing', level: 80, icon: '🎬' },
  ];

  const experience = [
    {
      year: '2024 - Present',
      role: 'Full-Stack Developer & Content Creator',
      company: 'Freelance',
      description: 'Building custom web applications and creating engaging digital content for clients worldwide',
      icon: Rocket,
      color: 'from-blue-600 to-cyan-600',
    },
    {
      year: '2022 - 2024',
      role: 'Web Developer',
      company: 'Local Projects',
      description: 'Developed e-commerce platforms, CMS solutions, and business websites for local businesses in Punjab',
      icon: Code,
      color: 'from-purple-600 to-pink-600',
    },
    {
      year: '2021 - 2022',
      role: 'UI/UX Designer',
      company: 'Freelance',
      description: 'Created user interfaces and brand identities for startups and small businesses',
      icon: Palette,
      color: 'from-green-600 to-emerald-600',
    },
    {
      year: '2020 - 2021',
      role: 'Video Editor',
      company: 'Content Creation',
      description: 'Produced and edited video content for social media marketing campaigns',
      icon: Video,
      color: 'from-orange-600 to-red-600',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Quality First',
      description: 'Delivering exceptional work that exceeds expectations',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Meeting deadlines without compromising on quality',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Heart,
      title: 'Client Focused',
      description: 'Building lasting relationships through great service',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Learning',
      description: 'Staying updated with latest technologies and trends',
      gradient: 'from-yellow-500 to-orange-500',
    },
  ];

  const stats = [
    { label: 'Years Experience', value: '5+', icon: Calendar },
    { label: 'Projects Completed', value: '150+', icon: CheckCircle },
    { label: 'Happy Clients', value: '100+', icon: Users },
    { label: 'Coffee Consumed', value: '∞', icon: Coffee },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-primary-animated text-white overflow-hidden py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-slide-in-left">
              <span className="text-indigo-200 font-semibold text-sm uppercase tracking-wide">About Me</span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 mt-2">
                Hi, I&apos;m a <span className="text-yellow-300">Developer</span> & <span className="text-yellow-300">Creator</span>
              </h1>
              <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                I&apos;m a passionate full-stack developer and content creator from Ludhiana, Punjab. 
                I build modern web applications and create engaging digital content that helps 
                businesses grow and students learn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="/contact" className="btn bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4">
                  Get In Touch
                </a>
                <a href="/portfolio" className="btn glass hover:bg-white hover:bg-opacity-20 px-8 py-4 border-2 border-white">
                  View My Work
                </a>
              </div>
            </div>

            <div className="hidden lg:block animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-3xl blur-2xl opacity-50"></div>
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                        <stat.icon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-indigo-200">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My <span className="text-gradient">Skills</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Technologies and tools I work with to bring ideas to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <div 
                key={skill.name} 
                className={`card p-6 animate-scale-in animate-delay-${(index + 1) * 50}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{skill.icon}</span>
                    <span className="font-semibold text-gray-900">{skill.name}</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{skill.level}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Professional <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              My career path and professional experience
            </p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {experience.map((exp, index) => (
              <div 
                key={exp.year}
                className={`card-interactive p-8 animate-slide-in-left animate-delay-${(index + 1) * 100}`}
              >
                <div className="flex gap-6">
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${exp.color} rounded-2xl flex items-center justify-center`}>
                    <exp.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                        <p className="text-indigo-600 font-semibold">{exp.company}</p>
                      </div>
                      <span className="badge badge-secondary">{exp.year}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Principles that guide my work and relationships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className={`card-interactive p-8 text-center animate-scale-in animate-delay-${(index + 1) * 100}`}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform`}>
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary-animated text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Star className="w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let&apos;s Build Something Great
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            I&apos;m always excited to take on new projects and collaborate with amazing people
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-4 text-lg">
              Start a Project
            </a>
            <a href="/portfolio" className="btn glass hover:bg-white hover:bg-opacity-20 px-10 py-4 text-lg border-2 border-white">
              View Portfolio
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}