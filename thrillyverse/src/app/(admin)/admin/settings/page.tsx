export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-bold">Settings</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5"><h2 className="font-semibold mb-2">Supabase</h2><p className="text-sm text-text-muted">Auth, RLS, schema, policies, and server helpers.</p></div>
        <div className="card p-5"><h2 className="font-semibold mb-2">Cloudinary</h2><p className="text-sm text-text-muted">Signed uploads for posters, covers, and media assets.</p></div>
        <div className="card p-5"><h2 className="font-semibold mb-2">EmailJS</h2><p className="text-sm text-text-muted">Public contact form mail delivery.</p></div>
        <div className="card p-5"><h2 className="font-semibold mb-2">Vercel</h2><p className="text-sm text-text-muted">Environment variables and deployment configuration.</p></div>
      </div>
    </div>
  );
}