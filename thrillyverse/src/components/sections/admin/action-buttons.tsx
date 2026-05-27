'use client';

import { useTransition } from 'react';
import {
  deleteRowAction,
  toggleAnnouncementActiveAction,
  toggleBlogPublishedAction,
  toggleCertificationActiveAction,
  toggleContactReadAction,
  toggleNotificationActiveAction,
  togglePartnerActiveAction,
  toggleQuizPublishedAction,
  toggleReviewPublishedAction,
} from '@/app/actions/admin';

export function DeleteButton({ table, id, paths }: { table: string; id: string; paths: string[] }) {
  const [pending, startTransition] = useTransition();
  return (
    <button className="btn btn-danger btn-sm" disabled={pending} onClick={() => startTransition(async () => deleteRowAction(table, id, paths))}>
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export function BlogPublishToggle({ id, published }: { id: string; published: boolean }) {
  const [pending, startTransition] = useTransition();
  return <button className={`btn btn-sm ${published ? 'btn-primary' : 'btn-secondary'}`} disabled={pending} onClick={() => startTransition(async () => toggleBlogPublishedAction(id, !published))}>{pending ? 'Saving...' : published ? 'Unpublish' : 'Publish'}</button>;
}

export function AnnouncementToggle({ id, active }: { id: string; active: boolean }) {
  const [pending, startTransition] = useTransition();
  return <button className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`} disabled={pending} onClick={() => startTransition(async () => toggleAnnouncementActiveAction(id, !active))}>{pending ? 'Saving...' : active ? 'Deactivate' : 'Activate'}</button>;
}

export function NotificationToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition();
  return <button className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`} disabled={pending} onClick={() => startTransition(async () => toggleNotificationActiveAction(id, !isActive))}>{pending ? 'Saving...' : isActive ? 'Deactivate' : 'Activate'}</button>;
}

export function ContactReadToggle({ id, read }: { id: string; read: boolean }) {
  const [pending, startTransition] = useTransition();
  return <button className={`btn btn-sm ${read ? 'btn-secondary' : 'btn-primary'}`} disabled={pending} onClick={() => startTransition(async () => toggleContactReadAction(id, !read))}>{pending ? 'Saving...' : read ? 'Mark unread' : 'Mark read'}</button>;
}

export function QuizPublishToggle({ id, published }: { id: string; published: boolean }) {
  const [pending, startTransition] = useTransition();
  return <button className={`btn btn-sm ${published ? 'btn-primary' : 'btn-secondary'}`} disabled={pending} onClick={() => startTransition(async () => toggleQuizPublishedAction(id, !published))}>{pending ? 'Saving...' : published ? 'Unpublish' : 'Publish'}</button>;
}

export function PartnerToggle({ id, active }: { id: string; active: boolean }) {
  const [pending, startTransition] = useTransition();
  return <button className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`} disabled={pending} onClick={() => startTransition(async () => togglePartnerActiveAction(id, !active))}>{pending ? 'Saving...' : active ? 'Hide' : 'Show'}</button>;
}

export function ReviewToggle({ id, published }: { id: string; published: boolean }) {
  const [pending, startTransition] = useTransition();
  return <button className={`btn btn-sm ${published ? 'btn-primary' : 'btn-secondary'}`} disabled={pending} onClick={() => startTransition(async () => toggleReviewPublishedAction(id, !published))}>{pending ? 'Saving...' : published ? 'Unpublish' : 'Publish'}</button>;
}

export function CertificationToggle({ id, active }: { id: string; active: boolean }) {
  const [pending, startTransition] = useTransition();
  return <button className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`} disabled={pending} onClick={() => startTransition(async () => toggleCertificationActiveAction(id, !active))}>{pending ? 'Saving...' : active ? 'Hide' : 'Show'}</button>;
}