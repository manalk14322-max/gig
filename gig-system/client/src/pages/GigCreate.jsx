import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiSuggest, createGig, fetchProfile } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';

const categories = [
  'Web Development',
  'Graphic Design',
  'Digital Marketing',
  'Video Editing',
  'Writing & Translation',
  'AI Services',
  'Business',
  'Finance',
];

const steps = [
  { id: 1, title: 'Overview', helper: 'Title, category, and positioning' },
  { id: 2, title: 'Pricing', helper: 'Base price and quick task delivery' },
  { id: 3, title: 'Packages', helper: 'Custom services and add-ons' },
  { id: 4, title: 'Media + Extras', helper: 'Images, optional video, FAQs, requirements' },
];

const emptyService = () => ({
  title: '',
  price: 0,
  durationHours: 2,
  included: [''],
});

const emptyFaq = () => ({
  question: '',
  answer: '',
});

const emptyRequirement = () => ({
  question: '',
  type: 'text',
  options: '',
  mandatory: true,
});

function percent(step) {
  return `${(step / steps.length) * 100}%`;
}

export default function GigCreate() {
  const { user } = useAuth();
  const { t } = useLang();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    tags: '',
    basePrice: 15000,
    deliveryDays: 3,
    quickTask: false,
    quickDeliveryHours: 2,
    images: ['', '', ''],
    videoUrl: '',
    featured: true,
  });
  const [services, setServices] = useState([emptyService()]);
  const [faqs, setFaqs] = useState([emptyFaq()]);
  const [requirements, setRequirements] = useState([emptyRequirement()]);
  const [aiStatus, setAiStatus] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const sellerSummary = profile || user || {
    name: 'Your profile',
    title: 'Complete student details',
    location: 'Pakistan',
    university: '',
    department: '',
    studentId: '',
    portfolio: [],
  };

  useEffect(() => {
    if (!user) return;
    fetchProfile().then(setProfile).catch(() => setProfile(null));
  }, [user]);

  const tagList = useMemo(
    () =>
      form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tags],
  );

  const profileComplete =
    !!profile &&
    !!profile.title &&
    !!profile.location &&
    !!profile.description &&
    (profile.skills || []).length > 0 &&
    !!profile.university &&
    !!profile.universityEmail &&
    !!profile.department &&
    !!profile.studentId &&
    (profile.verifiedStudent || profile.verificationStatus === 'verified') &&
    profile.role === 'seller';

  const handleServiceChange = (index, field, value) => {
    setServices((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleIncludeChange = (serviceIndex, includeIndex, value) => {
    setServices((prev) =>
      prev.map((item, idx) => {
        if (idx !== serviceIndex) return item;
        const nextIncluded = item.included.map((feature, fIdx) => (fIdx === includeIndex ? value : feature));
        return { ...item, included: nextIncluded };
      }),
    );
  };

  const addInclude = (serviceIndex) => {
    setServices((prev) =>
      prev.map((item, idx) =>
        idx === serviceIndex ? { ...item, included: [...item.included, ''] } : item,
      ),
    );
  };

  const removeService = (index) => {
    setServices((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addService = () => setServices((prev) => [...prev, emptyService()]);

  const handleImageChange = (index, value) => {
    setForm((prev) => {
      const nextImages = [...prev.images];
      nextImages[index] = value;
      return { ...prev, images: nextImages };
    });
  };

  const handleFaqChange = (index, field, value) => {
    setFaqs((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const addFaq = () => setFaqs((prev) => [...prev, emptyFaq()]);

  const removeFaq = (index) => {
    setFaqs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRequirementChange = (index, field, value) => {
    setRequirements((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const addRequirement = () => setRequirements((prev) => [...prev, emptyRequirement()]);

  const removeRequirement = (index) => {
    setRequirements((prev) => prev.filter((_, idx) => idx !== index));
  };

  const runAiSuggest = async () => {
    if (!form.title && !form.description) {
      setAiStatus('Add a title or description first, then I can suggest better pricing and tags.');
      return;
    }
    setAiStatus('Generating AI suggestions...');
    try {
      const response = await Promise.race([
        aiSuggest({
          title: form.title,
          description: form.description,
          category: form.category,
          budget: form.basePrice,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 12000)),
      ]);
      setForm((prev) => ({
        ...prev,
        basePrice: response.price,
        description: response.description,
        tags: response.tags.join(', '),
        deliveryDays: response.deliveryDays,
      }));
      setAiStatus('AI suggestions applied.');
    } catch {
      setAiStatus('AI service unavailable. Start the server at http://localhost:5050 and try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('');
    if (!user) {
      setSubmitStatus('Please login to publish a gig.');
      return;
    }
    if (user.role !== 'seller') {
      setSubmitStatus('Switch to seller mode first, then complete your student profile.');
      return;
    }
    if (!profileComplete) {
      setSubmitStatus('Please complete your student profile and get verified before creating a gig.');
      setStep(1);
      return;
    }

    const missing = [];
    if (!form.title.trim()) missing.push('title');
    if (!form.description.trim()) missing.push('description');
    if (!form.category.trim()) missing.push('category');
    if (!Number(form.basePrice)) missing.push('base price');
    if (!Number(form.deliveryDays)) missing.push('delivery days');
    if ((form.images || []).filter((item) => item.trim()).length < 2) missing.push('at least 2 images');
    if (missing.length) {
      const firstMissing = missing[0];
      if (firstMissing === 'title' || firstMissing === 'description' || firstMissing === 'category') {
        setStep(1);
      } else if (firstMissing === 'base price' || firstMissing === 'delivery days') {
        setStep(2);
      } else if (firstMissing === 'at least 2 images') {
        setStep(4);
      }
      setSubmitStatus(`Please complete: ${missing.join(', ')}.`);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        tags: tagList,
        basePrice: Number(form.basePrice),
        deliveryDays: Number(form.deliveryDays),
        quickTask: form.quickTask,
        quickDeliveryHours: Number(form.quickDeliveryHours),
        images: form.images.map((item) => item.trim()).filter(Boolean),
        videoUrl: form.videoUrl.trim(),
        featured: form.featured,
        services: services.map((item) => ({
          ...item,
          price: Number(item.price),
          durationHours: Number(item.durationHours),
          included: item.included.filter(Boolean),
        })),
        faqs: faqs
          .map((item) => ({
            question: item.question.trim(),
            answer: item.answer.trim(),
          }))
          .filter((item) => item.question && item.answer),
        requirements: requirements
          .map((item) => ({
            question: item.question.trim(),
            type: item.type,
            options:
              item.type === 'multiple-choice'
                ? item.options
                    .split(',')
                    .map((opt) => opt.trim())
                    .filter(Boolean)
                : [],
            mandatory: Boolean(item.mandatory),
          }))
          .filter((item) => item.question),
      };
      await createGig(payload);
      setAiStatus('Gig published successfully.');
      setForm((prev) => ({ ...prev, title: '', description: '', tags: '', images: ['', '', ''], videoUrl: '' }));
      setServices([emptyService()]);
      setFaqs([emptyFaq()]);
      setRequirements([emptyRequirement()]);
      setStep(1);
    } catch (error) {
      setSubmitStatus(error?.response?.data?.error || 'Could not publish gig. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const previewTitle = form.title || 'Your gig title will appear here';
  const previewDescription = form.description || 'Add a strong description, then the preview updates as you type.';
  const previewImage = form.images.find((item) => item.trim()) || '';
  const checklistItems = [
    { label: 'Student profile complete', done: profileComplete },
    { label: 'University email verified', done: !!profile?.universityEmail },
    { label: 'At least 2 images added', done: form.images.filter((item) => item.trim()).length >= 2 },
    { label: 'Title and description filled', done: !!form.title.trim() && !!form.description.trim() },
    { label: 'Student verification applied', done: !!profile?.verifiedStudent || profile?.verificationStatus === 'verified' },
    { label: 'FAQs added (optional)', done: faqs.some((item) => item.question.trim() && item.answer.trim()) },
    { label: 'Requirements added (optional)', done: requirements.some((item) => item.question.trim()) },
  ];
  const checklistDone = checklistItems.filter((item) => item.done).length;

  return (
    <div className="space-y-8 pb-24 md:pb-10">
      {!user && (
        <div className="rounded-[24px] border border-border-color bg-card-bg p-6 shadow-soft">
          <p className="font-semibold text-ink">Login required</p>
          <p className="mt-1 text-sm text-muted">Please login or sign up to create a gig.</p>
        </div>
      )}

      {user && !profileComplete && (
        <div className="rounded-[24px] border border-border-color bg-[#EEF2F7] p-6 shadow-soft">
          <p className="font-semibold text-ink">Complete your student profile first</p>
          <p className="mt-1 text-sm text-muted">Add title, location, description, skills, and campus details to unlock gig creation.</p>
          <Link className="btn-secondary mt-4 inline-flex" to="/profile">
            Complete profile
          </Link>
        </div>
      )}

      <section className="overflow-hidden rounded-[28px] border border-border-color bg-card-bg shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[1.35fr,0.65fr]">
          <div className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Gig creation</p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-3xl font-semibold text-ink md:text-5xl">{t('createGigTitle')}</h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                  Profile first, gig later. A clean builder for pricing, packages, media, and an optional video intro.
                </p>
              </div>
              <button className="btn-gradient" type="button" onClick={runAiSuggest}>
                AI Suggest
              </button>
            </div>
            {aiStatus && <p className="mt-4 text-sm text-primary">{aiStatus}</p>}

            <div className="mt-4 rounded-[22px] border border-border-color bg-[#EEF2F7] p-4 text-sm text-muted">
              Gig creation is unlocked after a completed student profile with verified campus details.
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {steps.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={`rounded-[22px] border p-4 text-left transition ${
                    step === item.id
                      ? 'border-secondary bg-[#F7F3EA] shadow-soft'
                      : 'border-border-color bg-[#EEF2F7] hover:bg-[#E7EDF4]'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.helper}</p>
                </button>
              ))}
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-soft">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: percent(step) }} />
            </div>
          </div>

          <aside className="border-t border-border-color bg-[#EEF2F7] p-5 lg:border-l lg:border-t-0 lg:sticky lg:top-24 h-fit">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Preview</p>
            <div className="mt-4 overflow-hidden rounded-[24px] bg-primary shadow-lift">
              <div className="aspect-[3/4] w-full bg-black">
                {form.videoUrl ? (
                  <video className="h-full w-full object-cover" controls>
                    <source src={form.videoUrl} />
                  </video>
                ) : (
                  <div className="grid h-full place-items-center px-6 text-center text-sm text-white/75">
                    Compact preview
                  </div>
                )}
              </div>
              <div className="space-y-3 p-4 text-white">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">{form.category}</p>
                <p className="text-xl font-semibold leading-tight">{previewTitle}</p>
                <p className="text-sm leading-6 text-white/80">{previewDescription}</p>
                <div className="flex flex-wrap gap-2">
                  {tagList.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
                {previewImage ? (
                  <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white/5">
                    <img src={previewImage} alt="Preview" className="h-24 w-full object-cover" />
                  </div>
                ) : (
                  <div className="rounded-[18px] border border-dashed border-white/20 px-4 py-4 text-xs text-white/70">
                    Add 2-3 images for a stronger listing.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[1.35fr,0.65fr]">
        <div className="space-y-6">
          <section className={`rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft ${step === 1 ? '' : 'hidden'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Step 1</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">Gig essentials</h2>
              </div>
              <span className="text-xs text-muted">Overview</span>
            </div>
            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-[20px] border border-[#E5E7EB] px-4 py-3"
                placeholder="Gig title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
              <textarea
                className="w-full rounded-[20px] border border-[#E5E7EB] px-4 py-3"
                rows="5"
                placeholder="Describe your gig"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  className="rounded-[20px] border border-[#E5E7EB] px-4 py-3"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <input
                  className="rounded-[20px] border border-[#E5E7EB] px-4 py-3"
                  placeholder="Tags (comma separated)"
                  value={form.tags}
                  onChange={(event) => setForm({ ...form, tags: event.target.value })}
                />
              </div>
            </div>
          </section>

          <section className={`rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft ${step === 2 ? '' : 'hidden'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Step 2</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">Pricing + delivery</h2>
              </div>
              <span className="text-xs text-muted">Flexible packages</span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                type="number"
                className="rounded-[20px] border border-[#E5E7EB] px-4 py-3"
                placeholder="Base price"
                value={form.basePrice}
                onChange={(event) => setForm({ ...form, basePrice: event.target.value })}
              />
              <input
                type="number"
                className="rounded-[20px] border border-[#E5E7EB] px-4 py-3"
                placeholder="Delivery days"
                value={form.deliveryDays}
                onChange={(event) => setForm({ ...form, deliveryDays: event.target.value })}
              />
            </div>
            <label className="mt-4 flex items-center gap-3 rounded-[20px] border border-border-color bg-[#EEF2F7] px-4 py-3 text-sm font-semibold text-muted">
              <input
                type="checkbox"
                checked={form.quickTask}
                onChange={(event) => setForm({ ...form, quickTask: event.target.checked })}
              />
              Quick Task Mode (1-2 hour delivery)
            </label>
            {form.quickTask && (
              <input
                type="number"
                className="mt-4 w-full rounded-[20px] border border-border-color px-4 py-3"
                placeholder="Quick delivery hours"
                value={form.quickDeliveryHours}
                onChange={(event) => setForm({ ...form, quickDeliveryHours: event.target.value })}
              />
            )}
          </section>

          <section className={`rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft ${step === 3 ? '' : 'hidden'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Step 3</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">Packages & add-ons</h2>
              </div>
              <button className="btn-ghost text-sm" type="button" onClick={addService}>
                Add service
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {services.map((service, index) => (
                <div key={`service-${index}`} className="rounded-[22px] border border-border-color bg-[#EEF2F7] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      className="w-full rounded-full border border-border-color bg-[#EEF2F7] px-4 py-3 text-sm"
                      placeholder="Service title (logo, social kit, etc.)"
                      value={service.title}
                      onChange={(event) => handleServiceChange(index, 'title', event.target.value)}
                    />
                    {services.length > 1 && (
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary hover:text-secondary"
                        onClick={() => removeService(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <input
                      type="number"
                      className="rounded-full border border-border-color bg-[#EEF2F7] px-4 py-3 text-sm"
                      placeholder="Price"
                      value={service.price}
                      onChange={(event) => handleServiceChange(index, 'price', event.target.value)}
                    />
                    <input
                      type="number"
                      className="rounded-full border border-border-color bg-[#EEF2F7] px-4 py-3 text-sm"
                      placeholder="Duration (hours)"
                      value={service.durationHours}
                      onChange={(event) => handleServiceChange(index, 'durationHours', event.target.value)}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    {service.included.map((feature, fIdx) => (
                      <input
                        key={`feature-${index}-${fIdx}`}
                      className="w-full rounded-full border border-border-color bg-[#EEF2F7] px-4 py-3 text-sm"
                        placeholder="Included feature"
                        value={feature}
                        onChange={(event) => handleIncludeChange(index, fIdx, event.target.value)}
                      />
                    ))}
                    <button className="text-xs font-semibold text-primary" type="button" onClick={() => addInclude(index)}>
                      Add included feature
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={`rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft ${step === 4 ? '' : 'hidden'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Step 4</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">Media + extras</h2>
              </div>
              <span className="text-xs text-muted">Optional video intro</span>
            </div>
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {form.images.map((image, index) => (
                  <input
                    key={`image-${index}`}
                    className="rounded-[20px] border border-border-color px-4 py-3"
                    placeholder={`Image ${index + 1} URL`}
                    value={image}
                    onChange={(event) => handleImageChange(index, event.target.value)}
                  />
                ))}
              </div>
              <input
                className="w-full rounded-[20px] border border-border-color px-4 py-3"
                placeholder="Video intro URL (optional)"
                value={form.videoUrl}
                onChange={(event) => setForm({ ...form, videoUrl: event.target.value })}
              />
              <p className="text-xs text-muted">Video is optional. Add it later if you want a richer preview.</p>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[22px] border border-border-color bg-[#EEF2F7] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">FAQs (optional)</p>
                  <button className="btn-ghost text-xs" type="button" onClick={addFaq}>
                    Add FAQ
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {faqs.map((item, index) => (
                    <div key={`faq-${index}`} className="rounded-[18px] border border-border-color bg-white p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">FAQ {index + 1}</p>
                        {faqs.length > 1 && (
                          <button
                            type="button"
                            className="text-xs font-semibold text-primary"
                            onClick={() => removeFaq(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        className="mt-2 w-full rounded-[18px] border border-border-color px-3 py-2 text-sm"
                        placeholder="Question"
                        value={item.question}
                        onChange={(event) => handleFaqChange(index, 'question', event.target.value)}
                      />
                      <textarea
                        className="mt-2 w-full rounded-[18px] border border-border-color px-3 py-2 text-sm"
                        rows="3"
                        placeholder="Answer"
                        value={item.answer}
                        onChange={(event) => handleFaqChange(index, 'answer', event.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-border-color bg-[#EEF2F7] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">Buyer requirements (optional)</p>
                  <button className="btn-ghost text-xs" type="button" onClick={addRequirement}>
                    Add
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {requirements.map((item, index) => (
                    <div key={`req-${index}`} className="rounded-[18px] border border-border-color bg-white p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                          Requirement {index + 1}
                        </p>
                        {requirements.length > 1 && (
                          <button
                            type="button"
                            className="text-xs font-semibold text-primary"
                            onClick={() => removeRequirement(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        className="mt-2 w-full rounded-[18px] border border-border-color px-3 py-2 text-sm"
                        placeholder="Question or file request"
                        value={item.question}
                        onChange={(event) => handleRequirementChange(index, 'question', event.target.value)}
                      />
                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        <select
                          className="rounded-[18px] border border-border-color px-3 py-2 text-sm"
                          value={item.type}
                          onChange={(event) => handleRequirementChange(index, 'type', event.target.value)}
                        >
                          <option value="text">Text response</option>
                          <option value="file">File upload</option>
                          <option value="multiple-choice">Multiple choice</option>
                        </select>
                        <label className="flex items-center gap-2 rounded-[18px] border border-border-color bg-white px-3 py-2 text-xs font-semibold text-muted">
                          <input
                            type="checkbox"
                            checked={item.mandatory}
                            onChange={(event) => handleRequirementChange(index, 'mandatory', event.target.checked)}
                          />
                          Required
                        </label>
                      </div>
                      {item.type === 'multiple-choice' && (
                        <input
                          className="mt-2 w-full rounded-[18px] border border-border-color px-3 py-2 text-sm"
                          placeholder="Options (comma separated)"
                          value={item.options}
                          onChange={(event) => handleRequirementChange(index, 'options', event.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="btn-ghost disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={step === 1}
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            >
              Back
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setStep((prev) => Math.min(steps.length, prev + 1))}
            >
              Continue
            </button>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Student summary</p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">{sellerSummary.name}</h3>
            <p className="mt-1 text-sm text-muted">{sellerSummary.title}</p>
            <p className="mt-1 text-sm text-muted">{sellerSummary.location}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  profileComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {profileComplete ? 'Ready to publish' : 'Profile first'}
              </span>
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                {sellerSummary.role === 'seller' ? 'Student seller account' : 'Buyer account'}
              </span>
            </div>
            {(sellerSummary.university || sellerSummary.department) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {sellerSummary.university && (
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                    {sellerSummary.university}
                  </span>
                )}
                {sellerSummary.department && (
              <span className="rounded-full bg-[#EEF2F7] px-3 py-1 text-xs font-semibold text-ink">
                    {sellerSummary.department}
                  </span>
                )}
              </div>
            )}
              <div className="mt-4 rounded-[22px] bg-[#EEF2F7] p-4">
              <p className="text-sm font-semibold text-ink">Portfolio links</p>
              <ul className="mt-2 space-y-1 text-xs text-primary">
                {(sellerSummary.portfolio || ['Add portfolio links in your profile']).map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-[28px] border border-border-color bg-[#EEF2F7] p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Campus checklist</p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>Title, description, category, and tags</li>
              <li>Base price and delivery estimate</li>
              <li>Custom services and add-ons</li>
              <li>Images and optional video intro</li>
              <li>Optional FAQs and buyer requirements</li>
            </ul>
          </div>

          <div className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Live checklist</p>
            <div className="mt-4 rounded-[22px] border border-border-color bg-[#EEF2F7] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Gig readiness</p>
                  <p className="mt-1 text-xs text-muted">
                    {checklistDone} of {checklistItems.length} items complete
                  </p>
                </div>
                <span className="price-pill">{Math.round((checklistDone / checklistItems.length) * 100)}%</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-[#EEF2F7]">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${(checklistDone / checklistItems.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {checklistItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-[18px] bg-[#EEF2F7] px-4 py-3">
                  <p className="text-sm text-ink">{item.label}</p>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.done ? 'Done' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft">
            <button className="btn-gradient w-full" type="submit" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish gig'}
            </button>
            {submitStatus && <p className="mt-3 text-sm text-primary">{submitStatus}</p>}
          </div>
        </aside>
      </form>
    </div>
  );
}
