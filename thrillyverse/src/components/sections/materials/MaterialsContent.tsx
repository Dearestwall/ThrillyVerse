'use client';

import { useMemo, useState } from 'react';
import { Bell, BookOpen, HelpCircle, Download, ExternalLink, Search, Filter } from 'lucide-react';
import type { Material, Notification, Quiz } from '@/types';
import { EmptyState } from '@/components/common/EmptyState';

export function MaterialsContent({ materials, quizzes, notifications }: {
  materials: Material[];
  quizzes: Quiz[];
  notifications: Notification[];
}) {
  const [tab, setTab] = useState<'materials' | 'quizzes' | 'notifications'>('materials');
  const [search, setSearch] = useState('');
  const [board, setBoard] = useState('All');

  const boards = useMemo(() => {
    const b = Array.from(new Set(materials.map(m => m.board).filter(Boolean)));
    return ['All', ...b];
  }, [materials]);

  const filteredMaterials = useMemo(() =>
    materials.filter(m => {
      const matchBoard = board === 'All' || m.board === board;
      const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.subject?.toLowerCase().includes(search.toLowerCase());
      return matchBoard && matchSearch;
    }),
  [materials, search, board]);

  const tabs = [
    { id: 'materials',     label: 'Materials',      icon: BookOpen,   count: materials.length },
    { id: 'quizzes',       label: 'Quizzes',         icon: HelpCircle, count: quizzes.length },
    { id: 'notifications', label: 'Notifications',   icon: Bell,       count: notifications.length },
  ] as const;

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b mb-8 pb-4" style={{ borderColor: 'var(--color-divider)' }}>
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            className={`btn btn-sm ${tab === id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(id)}
          >
            <Icon size={14} />
            {label}
            {count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === id ? 'bg-white/20' : 'bg-surface-offset'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Materials */}
      {tab === 'materials' && (
        <>
          {/* Filter row */}
          <div className="filter-bar mb-6">
            <div className="search-input-wrapper">
              <Search size={14} />
              <input
                className="form-input search-input"
                placeholder="Search materials…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {boards.map(b => (
                <button
                  key={b}
                  className={`filter-chip ${board === b ? 'active' : ''}`}
                  onClick={() => setBoard(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {filteredMaterials.length ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredMaterials.map((item: Material, i) => (
                <article key={item.id} className="card material-card section-reveal" style={{ animationDelay: `${i * 40}ms` }}>
                  <span className="material-subject-tag">{item.subject}</span>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-sm leading-snug">{item.title}</h3>
                      <p className="text-xs text-text-faint mt-1">{item.board} · Class {item.class_level}</p>
                    </div>
                    {item.featured && <span className="badge badge-gold flex-shrink-0">⭐</span>}
                  </div>
                  {item.description && <p className="text-sm text-text-muted mb-4 leading-relaxed">{item.description}</p>}
                  <div className="flex gap-2 mt-auto">
                    {item.resource_link && (
                      <a href={item.resource_link} className="btn btn-primary btn-sm flex-1" target="_blank" rel="noreferrer">
                        <ExternalLink size={12} /> Open
                      </a>
                    )}
                    {item.download_link && (
                      <a href={item.download_link} className="btn btn-secondary btn-sm" target="_blank" rel="noreferrer">
                        <Download size={12} /> Download
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No materials found" description="Try a different search or board filter." />
          )}
        </>
      )}

      {/* Quizzes */}
      {tab === 'quizzes' && (
        quizzes.length ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {quizzes.map((quiz: Quiz, i) => (
              <article key={quiz.id} className="card quiz-card section-reveal" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="quiz-card-header">
                  <h3 className="font-bold text-base leading-snug">{quiz.title}</h3>
                  <span className={`badge quiz-difficulty-${quiz.difficulty?.toLowerCase()} flex-shrink-0`}>
                    {quiz.difficulty}
                  </span>
                </div>
                {quiz.description && <p className="text-sm text-text-muted leading-relaxed">{quiz.description}</p>}
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-muted">{quiz.board}</span>
                  <span className="badge badge-muted">Class {quiz.class_level}</span>
                  <span className="badge badge-muted">{quiz.subject}</span>
                </div>
                <button className="btn btn-primary btn-sm w-full mt-auto">🧠 Start Quiz</button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No quizzes found" description="Add quizzes from admin." />
        )
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        notifications.length ? (
          <div className="space-y-3">
            {notifications.map((n: Notification, i) => (
              <div key={n.id} className="notif-card section-reveal" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="notif-icon">🔔</div>
                <div>
                  <p className="font-bold text-sm mb-1">{n.title}</p>
                  <p className="text-sm text-text-muted leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No notifications" description="Notifications will appear here." />
        )
      )}
    </div>
  );
}
