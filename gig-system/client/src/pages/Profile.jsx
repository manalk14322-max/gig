import { useEffect, useState } from 'react';
import { fetchProfile, requestVerification, updateProfile } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';

export default function Profile() {
  const { user, ready } = useAuth();
  const { t } = useLang();
  const [form, setForm] = useState({
    name: '',
    title: '',
    location: '',
    avatarUrl: '',
    description: '',
    skills: '',
    portfolio: '',
    role: 'buyer',
    university: '',
    universityEmail: '',
    department: '',
    studentId: '',
    verificationStatus: 'pending',
    verifiedStudent: false,
  });
  const [idImage, setIdImage] = useState('');
  const [selfieImage, setSelfieImage] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!ready) return;
    fetchProfile()
      .then((data) => {
        setForm({
          name: data.name || '',
          title: data.title || '',
          location: data.location || '',
          avatarUrl: data.avatarUrl || '',
          description: data.description || '',
          skills: (data.skills || []).join(', '),
          portfolio: (data.portfolio || []).join(', '),
          role: data.role || 'buyer',
          university: data.university || '',
          universityEmail: data.universityEmail || '',
          department: data.department || '',
          studentId: data.studentId || '',
          verificationStatus: data.verificationStatus || 'pending',
          verifiedStudent: Boolean(data.verifiedStudent),
        });
        setIdImage(data.verificationDocs?.idImage || '');
        setSelfieImage(data.verificationDocs?.selfieImage || '');
      })
      .catch(() => {});
  }, [ready]);

  if (!user) {
    return <p className="text-muted">Please login to edit your profile.</p>;
  }

  const isSeller = form.role === 'seller';

  const submit = async (event) => {
    event.preventDefault();
    setStatus('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        title: form.title,
        location: form.location,
        avatarUrl: form.avatarUrl,
        description: form.description,
        skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
        portfolio: form.portfolio.split(',').map((item) => item.trim()).filter(Boolean),
        role: form.role,
        university: form.university,
        universityEmail: form.universityEmail,
        department: form.department,
        studentId: form.studentId,
      };
      const updated = await updateProfile(payload);
      setStatus(`Profile updated for ${updated.name}.`);
    } catch (error) {
      setStatus(error?.response?.data?.error || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleFile = (file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const submitVerification = async () => {
    setVerifyStatus('');
    if (!idImage || !selfieImage) {
      setVerifyStatus('Please upload both your university ID and a selfie.');
      return;
    }
    setVerifying(true);
    try {
      await requestVerification({ idImage, selfieImage });
      setVerifyStatus('Verification request submitted. You will see the badge after approval.');
    } catch (error) {
      setVerifyStatus(error?.response?.data?.error || 'Could not submit verification request.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 md:pb-10">
      <section className="overflow-hidden rounded-[30px] border border-border-color bg-card-bg shadow-soft">
        <div className="bg-gradient-to-r from-[#FBF8F2] via-white to-[#F5E7C8] px-6 py-7 md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Profile settings</p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-ink md:text-5xl">
                {t('profileTitle')}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted md:text-base">
                Add your campus identity, seller details, and portfolio so buyers trust you before you create a gig.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  form.verifiedStudent ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {form.verifiedStudent ? 'Verified student' : 'Verification pending'}
              </span>
              <span className="rounded-full bg-[#F3F7FA] px-4 py-2 text-xs font-semibold text-ink shadow-soft">
                {form.role === 'seller' ? 'Seller profile' : 'Buyer profile'}
              </span>
              {form.university && (
                <span className="rounded-full bg-secondary/10 px-4 py-2 text-xs font-semibold text-secondary">
                  {form.university}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-border-color p-6 md:grid-cols-3">
          {[
            { label: 'Profile strength', value: form.verifiedStudent ? 'Strong' : 'Needs review' },
            { label: 'Student status', value: form.verifiedStudent ? 'Verified' : 'Pending' },
            { label: 'Gig access', value: form.role === 'seller' ? 'Unlock after completion' : 'Buyer mode' },
          ].map((item) => (
            <div key={item.label} className="rounded-[22px] border border-border-color bg-[#F3F7FA] px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Identity</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">Basic details</h2>
              </div>
              {isSeller && user?.id ? (
                <a className="btn-secondary" href={`/seller/${user.id}`}>
                  View public seller profile
                </a>
              ) : (
                <a className="btn-secondary" href="/buyer">
                  View buyer profile
                </a>
              )}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                placeholder="Full name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
              <select
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
              <input
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                placeholder="Title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
              <input
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                placeholder="Location"
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
              />
            </div>
          </section>

          {isSeller && (
            <section className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft">
              <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Seller-only fields</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">Student verification</h2>
              <p className="mt-2 text-sm text-muted">
                  These details help buyers trust you and unlock gig publishing.
              </p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                placeholder="University"
                value={form.university}
                onChange={(event) => setForm({ ...form, university: event.target.value })}
              />
              <input
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                placeholder="University email"
                type="email"
                value={form.universityEmail}
                onChange={(event) => setForm({ ...form, universityEmail: event.target.value })}
              />
              <input
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3 md:col-span-2"
                placeholder="Department"
                value={form.department}
                onChange={(event) => setForm({ ...form, department: event.target.value })}
              />
            </div>
              <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
                <input
                  className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                  placeholder="Student ID / Roll number"
                  value={form.studentId}
                  onChange={(event) => setForm({ ...form, studentId: event.target.value })}
                />
                <div className="rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-3 text-sm text-muted">
                  Verified student badge appears after review.
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-border-color bg-[#F3F7FA] p-4">
                <p className="text-sm font-semibold text-ink">Upload verification</p>
                <p className="mt-1 text-xs text-muted">
                  Add a clear university ID and a selfie. This is used for student verification.
                </p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-xs font-semibold text-muted">
                    University ID
                    <input
                      type="file"
                      accept="image/*"
                      className="rounded-2xl border border-border-color bg-white px-4 py-2 text-sm"
                      onChange={(event) => handleFile(event.target.files?.[0], setIdImage)}
                    />
                    {idImage && <img src={idImage} alt="University ID" className="h-24 w-full rounded-2xl object-cover" />}
                  </label>
                  <label className="flex flex-col gap-2 text-xs font-semibold text-muted">
                    Selfie
                    <input
                      type="file"
                      accept="image/*"
                      className="rounded-2xl border border-border-color bg-white px-4 py-2 text-sm"
                      onChange={(event) => handleFile(event.target.files?.[0], setSelfieImage)}
                    />
                    {selfieImage && <img src={selfieImage} alt="Selfie" className="h-24 w-full rounded-2xl object-cover" />}
                  </label>
                </div>
                <button
                  type="button"
                  className="btn-secondary mt-4"
                  onClick={submitVerification}
                  disabled={verifying}
                >
                  {verifying ? 'Submitting...' : 'Submit verification request'}
                </button>
                {verifyStatus && <p className="mt-2 text-xs text-primary">{verifyStatus}</p>}
              </div>
            </section>
          )}

          <section className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Bio & portfolio</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">Public profile content</h2>
            </div>
            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-2xl border border-border-color px-4 py-3"
                placeholder="Avatar URL"
                value={form.avatarUrl}
                onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })}
              />
              <textarea
                className="w-full rounded-2xl border border-border-color px-4 py-3"
                rows="4"
                placeholder="Short bio / description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
              <input
                className="w-full rounded-2xl border border-border-color px-4 py-3"
                placeholder="Skills (comma separated)"
                value={form.skills}
                onChange={(event) => setForm({ ...form, skills: event.target.value })}
              />
              <textarea
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3"
                rows="3"
                placeholder="Portfolio URLs (comma separated)"
                value={form.portfolio}
                onChange={(event) => setForm({ ...form, portfolio: event.target.value })}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <section className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Trust preview</p>
            <div className="mt-4 rounded-[22px] bg-gradient-to-r from-[#E6F4F1] to-[#F3F7FA] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Verification status</p>
                  <p className="mt-1 text-xs text-muted">
                    {form.verifiedStudent ? 'Campus identity confirmed' : 'Complete verification to unlock gig publishing'}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    form.verifiedStudent ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {form.verifiedStudent ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-[22px] bg-[#F3F7FA] p-4">
                <p className="text-sm text-muted">University</p>
                <p className="mt-1 font-semibold text-ink">{form.university || 'Not added yet'}</p>
              </div>
              <div className="rounded-[22px] bg-[#F3F7FA] p-4">
                <p className="text-sm text-muted">University email</p>
                <p className="mt-1 font-semibold text-ink">{form.universityEmail || 'Not added yet'}</p>
              </div>
              <div className="rounded-[22px] bg-[#F3F7FA] p-4">
                <p className="text-sm text-muted">Department</p>
                <p className="mt-1 font-semibold text-ink">{form.department || 'Not added yet'}</p>
              </div>
              <div className="rounded-[22px] bg-[#F3F7FA] p-4">
                <p className="text-sm text-muted">Student ID</p>
                <p className="mt-1 font-semibold text-ink">{form.studentId || 'Not added yet'}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-border-color bg-[#F3F7FA] p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Checklist</p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>Full name and role</li>
              <li>University, department, and student ID</li>
              <li>Short bio and portfolio</li>
              <li>Seller profile ready for gig creation</li>
            </ul>
          </section>

          <section className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft">
            <button className="btn-gradient w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            {status && <p className="mt-3 text-sm text-primary">{status}</p>}
          </section>
        </aside>
      </form>
    </div>
  );
}
