import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiSuggest, createGig, fetchProfile } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';

const categories = [
  'Graphics & Design',
  'Programming & Tech',
  'Digital Marketing',
  'Video & Animation',
  'Writing & Translation',
  'Business',
  'AI Services',
];

const steps = [
  { id: 1, title: 'Basics', helper: 'What you will offer' },
  { id: 2, title: 'Pricing', helper: 'Budget and delivery' },
  { id: 3, title: 'Packages', helper: 'Add-ons and scope' },
  { id: 4, title: 'Media', helper: 'Images and buyer info' },
];

const emptyService = () => ({ title: '', price: 5000, durationHours: 24, included: [''] });
const emptyFaq = () => ({ question: '', answer: '' });
const emptyRequirement = () => ({ question: '', type: 'text', options: '', mandatory: true });

const inputClass =
  'w-full rounded-[18px] border border-border-color bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10';
const labelClass = 'text-sm font-semibold text-ink';

function money(value) {
  return `PKR ${Number(value || 0).toLocaleString('en-PK')}`;
}

function percent(step) {
  return `${(step / steps.length) * 100}%`;
}

function Field({ label, helper, children }) {
  return (
    <label className="block space-y-2">
      <span className={labelClass}>{label}</span>
      {children}
      {helper && <span className="block text-xs leading-5 text-muted">{helper}</span>}
    </label>
  );
}

function StepShell({ eyebrow, title, helper, children }) {
  return (
    <section className="rounded-[24px] border border-border-color bg-card-bg p-4 shadow-soft sm:p-6">
      <div className="border-b border-border-color pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{helper}</p>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export default function GigCreate() {
  const { user } = useAuth();
  const { t } = useLang();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Programming & Tech',
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
  const [step, setStep] = useState(1);
  const [aiStatus, setAiStatus] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const sellerSummary = profile || user || {
    name: 'Your student profile',
    title: 'Complete your seller details first',
    location: 'Pakistan',
    university: '',
    department: '',
    role: '',
    portfolio: [],
  };

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateService = (index, field, value) => {
    setServices((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const updateIncluded = (serviceIndex, featureIndex, value) => {
    setServices((prev) =>
      prev.map((item, idx) =>
        idx === serviceIndex
          ? { ...item, included: item.included.map((feature, fIdx) => (fIdx === featureIndex ? value : feature)) }
          : item,
      ),
    );
  };

  const updateFaq = (index, field, value) => {
    setFaqs((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const updateRequirement = (index, field, value) => {
    setRequirements((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const updateImage = (index, value) => {
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const runAiSuggest = async () => {
    if (!form.title.trim() && !form.description.trim()) {
      setAiStatus('Add a title or description first.');
      return;
    }
    setAiStatus('Preparing suggestions...');
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
        basePrice: response.price || prev.basePrice,
        description: response.description || prev.description,
        tags: (response.tags || []).join(', ') || prev.tags,
        deliveryDays: response.deliveryDays || prev.deliveryDays,
      }));
      setAiStatus('Suggestions applied.');
    } catch {
      setAiStatus('AI suggestions are not available right now.');
    }
  };

  const publishGig = async (event) => {
    event.preventDefault();
    setSubmitStatus('');

    if (!user) {
      setSubmitStatus('Please login before publishing.');
      return;
    }
    if (user.role !== 'seller') {
      setSubmitStatus('Create or switch to a seller profile first.');
      return;
    }
    if (!profileComplete) {
      setSubmitStatus('Complete and verify your student profile before publishing.');
      setStep(1);
      return;
    }

    const missing = [];
    if (!form.title.trim()) missing.push('title');
    if (!form.description.trim()) missing.push('description');
    if (!Number(form.basePrice)) missing.push('base price');
    if (!Number(form.deliveryDays)) missing.push('delivery days');
    if (form.images.filter((item) => item.trim()).length < 2) missing.push('2 images');

    if (missing.length) {
      setSubmitStatus(`Please complete: ${missing.join(', ')}.`);
      if (missing.includes('title') || missing.includes('description')) setStep(1);
      else if (missing.includes('base price') || missing.includes('delivery days')) setStep(2);
      else setStep(4);
      return;
    }

    setSubmitting(true);
    try {
      await createGig({
        ...form,
        tags: tagList,
        basePrice: Number(form.basePrice),
        deliveryDays: Number(form.deliveryDays),
        quickDeliveryHours: Number(form.quickDeliveryHours),
        images: form.images.map((item) => item.trim()).filter(Boolean),
        videoUrl: form.videoUrl.trim(),
        services: services
          .map((item) => ({
            ...item,
            price: Number(item.price),
            durationHours: Number(item.durationHours),
            included: item.included.map((feature) => feature.trim()).filter(Boolean),
          }))
          .filter((item) => item.title.trim()),
        faqs: faqs
          .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }))
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
      });
      setSubmitStatus('Gig published successfully.');
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

  const checklist = [
    { label: 'Verified student seller', done: profileComplete },
    { label: 'Clear title', done: !!form.title.trim() },
    { label: 'Strong description', done: form.description.trim().length > 40 },
    { label: 'Price and delivery', done: Number(form.basePrice) > 0 && Number(form.deliveryDays) > 0 },
    { label: 'At least 2 images', done: form.images.filter((item) => item.trim()).length >= 2 },
    { label: 'Service package', done: services.some((item) => item.title.trim()) },
  ];
  const doneCount = checklist.filter((item) => item.done).length;
  const readiness = Math.round((doneCount / checklist.length) * 100);
  const previewImage = form.images.find((item) => item.trim());

  return (
    <div className="space-y-6 pb-28 md:pb-10">
      <section className="overflow-hidden rounded-[26px] border border-border-color bg-card-bg shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="p-5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Create gig</p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl">
              {t('createGigTitle')}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Build a clean, trusted service listing. UniHire keeps this process simple so verified students can publish professional gigs faster.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] bg-bg-light p-4">
                <p className="text-xl font-semibold text-primary">01</p>
                <p className="mt-1 text-sm font-semibold text-ink">Describe service</p>
              </div>
              <div className="rounded-[20px] bg-bg-light p-4">
                <p className="text-xl font-semibold text-primary">02</p>
                <p className="mt-1 text-sm font-semibold text-ink">Set package</p>
              </div>
              <div className="rounded-[20px] bg-bg-light p-4">
                <p className="text-xl font-semibold text-primary">03</p>
                <p className="mt-1 text-sm font-semibold text-ink">Publish after review</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border-color bg-bg-light p-5 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-sm font-semibold text-ink">Seller status</p>
            <div className="mt-4 rounded-[22px] bg-white p-4 shadow-soft">
              <p className="text-lg font-semibold text-ink">{sellerSummary.name}</p>
              <p className="mt-1 text-sm text-muted">{sellerSummary.title || 'Complete your profile'}</p>
              <p className="mt-1 text-xs text-muted">{sellerSummary.university || 'University details required'}</p>
              <span
                className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  profileComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {profileComplete ? 'Ready to publish' : 'Profile verification required'}
              </span>
              {!profileComplete && (
                <Link to="/profile" className="btn-secondary mt-4 w-full text-sm">
                  Complete profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {!user && (
        <div className="rounded-[22px] border border-border-color bg-white p-5 shadow-soft">
          <p className="font-semibold text-ink">Login required</p>
          <p className="mt-1 text-sm text-muted">You can prepare the gig, but publishing requires a seller account.</p>
          <Link to="/profile" className="btn-primary mt-4 text-sm">
            Login or create account
          </Link>
        </div>
      )}

      <form onSubmit={publishGig} className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]">
        <div className="space-y-5">
          <div className="rounded-[24px] border border-border-color bg-white p-4 shadow-soft">
            <div className="grid gap-3 sm:grid-cols-4">
              {steps.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={`rounded-[18px] border p-3 text-left transition ${
                    step === item.id
                      ? 'border-primary bg-soft text-primary'
                      : 'border-border-color bg-bg-light text-muted hover:text-primary'
                  }`}
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs">{item.helper}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 h-2 rounded-full bg-bg-light">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: percent(step) }} />
            </div>
          </div>

          {step === 1 && (
            <StepShell
              eyebrow="Step 1"
              title="Gig basics"
              helper="Keep the first impression clear. Tell clients exactly what you can deliver."
            >
              <Field label="Gig title" helper="Example: I will build a responsive React landing page">
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(event) => updateForm('title', event.target.value)}
                  placeholder="I will..."
                />
              </Field>

              <Field label="Description" helper="Explain scope, tools, deliverables, and what makes your service trusted.">
                <textarea
                  className={inputClass}
                  rows="6"
                  value={form.description}
                  onChange={(event) => updateForm('description', event.target.value)}
                  placeholder="Describe your service in a friendly, professional tone."
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <select className={inputClass} value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Search tags" helper="Separate tags with commas.">
                  <input
                    className={inputClass}
                    value={form.tags}
                    onChange={(event) => updateForm('tags', event.target.value)}
                    placeholder="react, portfolio, landing page"
                  />
                </Field>
              </div>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell eyebrow="Step 2" title="Pricing and delivery" helper="Set a fair starting price and a delivery promise you can keep.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Base price">
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    value={form.basePrice}
                    onChange={(event) => updateForm('basePrice', event.target.value)}
                  />
                </Field>
                <Field label="Delivery days">
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    value={form.deliveryDays}
                    onChange={(event) => updateForm('deliveryDays', event.target.value)}
                  />
                </Field>
              </div>

              <label className="flex items-start gap-3 rounded-[20px] border border-border-color bg-bg-light p-4">
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={form.quickTask}
                  onChange={(event) => updateForm('quickTask', event.target.checked)}
                />
                <span>
                  <span className="block text-sm font-semibold text-ink">Quick task mode</span>
                  <span className="mt-1 block text-xs leading-5 text-muted">Use this for small jobs you can deliver within hours.</span>
                </span>
              </label>

              {form.quickTask && (
                <Field label="Quick delivery hours">
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    value={form.quickDeliveryHours}
                    onChange={(event) => updateForm('quickDeliveryHours', event.target.value)}
                  />
                </Field>
              )}
            </StepShell>
          )}

          {step === 3 && (
            <StepShell eyebrow="Step 3" title="Packages and services" helper="Add small service blocks so buyers understand what they are paying for.">
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={`service-${index}`} className="rounded-[22px] border border-border-color bg-bg-light p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-semibold text-ink">Service {index + 1}</p>
                      {services.length > 1 && (
                        <button
                          type="button"
                          className="text-left text-xs font-semibold text-primary"
                          onClick={() => setServices((prev) => prev.filter((_, idx) => idx !== index))}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <input
                        className={`${inputClass} sm:col-span-3`}
                        value={service.title}
                        onChange={(event) => updateService(index, 'title', event.target.value)}
                        placeholder="Service title"
                      />
                      <input
                        className={inputClass}
                        type="number"
                        value={service.price}
                        onChange={(event) => updateService(index, 'price', event.target.value)}
                        placeholder="Price"
                      />
                      <input
                        className={inputClass}
                        type="number"
                        value={service.durationHours}
                        onChange={(event) => updateService(index, 'durationHours', event.target.value)}
                        placeholder="Hours"
                      />
                    </div>

                    <div className="mt-4 space-y-2">
                      {service.included.map((feature, featureIndex) => (
                        <input
                          key={`feature-${index}-${featureIndex}`}
                          className={inputClass}
                          value={feature}
                          onChange={(event) => updateIncluded(index, featureIndex, event.target.value)}
                          placeholder="Included feature"
                        />
                      ))}
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary"
                        onClick={() =>
                          setServices((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, included: [...item.included, ''] } : item,
                            ),
                          )
                        }
                      >
                        Add included feature
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-ghost w-full text-sm" onClick={() => setServices((prev) => [...prev, emptyService()])}>
                Add another service
              </button>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell eyebrow="Step 4" title="Media and buyer info" helper="Add visuals, FAQs, and what you need from the buyer before starting.">
              <div className="grid gap-4 sm:grid-cols-3">
                {form.images.map((image, index) => (
                  <Field key={`image-${index}`} label={`Image ${index + 1}`}>
                    <input className={inputClass} value={image} onChange={(event) => updateImage(index, event.target.value)} placeholder="Image URL" />
                  </Field>
                ))}
              </div>

              <Field label="Video intro URL" helper="Optional, but useful for a premium gig preview.">
                <input className={inputClass} value={form.videoUrl} onChange={(event) => updateForm('videoUrl', event.target.value)} placeholder="https://..." />
              </Field>

              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-[22px] border border-border-color bg-bg-light p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">FAQs</p>
                    <button type="button" className="text-xs font-semibold text-primary" onClick={() => setFaqs((prev) => [...prev, emptyFaq()])}>
                      Add FAQ
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {faqs.map((item, index) => (
                      <div key={`faq-${index}`} className="rounded-[18px] bg-white p-3">
                        <input
                          className={inputClass}
                          value={item.question}
                          onChange={(event) => updateFaq(index, 'question', event.target.value)}
                          placeholder="Question"
                        />
                        <textarea
                          className={`${inputClass} mt-2`}
                          rows="3"
                          value={item.answer}
                          onChange={(event) => updateFaq(index, 'answer', event.target.value)}
                          placeholder="Answer"
                        />
                        {faqs.length > 1 && (
                          <button type="button" className="mt-2 text-xs font-semibold text-primary" onClick={() => setFaqs((prev) => prev.filter((_, idx) => idx !== index))}>
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-border-color bg-bg-light p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">Buyer requirements</p>
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary"
                      onClick={() => setRequirements((prev) => [...prev, emptyRequirement()])}
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {requirements.map((item, index) => (
                      <div key={`requirement-${index}`} className="rounded-[18px] bg-white p-3">
                        <input
                          className={inputClass}
                          value={item.question}
                          onChange={(event) => updateRequirement(index, 'question', event.target.value)}
                          placeholder="What do you need from buyer?"
                        />
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <select className={inputClass} value={item.type} onChange={(event) => updateRequirement(index, 'type', event.target.value)}>
                            <option value="text">Text</option>
                            <option value="file">File upload</option>
                            <option value="multiple-choice">Multiple choice</option>
                          </select>
                          <label className="flex items-center gap-2 rounded-[18px] border border-border-color bg-white px-4 py-3 text-xs font-semibold text-muted">
                            <input
                              type="checkbox"
                              checked={item.mandatory}
                              onChange={(event) => updateRequirement(index, 'mandatory', event.target.checked)}
                            />
                            Required
                          </label>
                        </div>
                        {item.type === 'multiple-choice' && (
                          <input
                            className={`${inputClass} mt-2`}
                            value={item.options}
                            onChange={(event) => updateRequirement(index, 'options', event.target.value)}
                            placeholder="Options separated by commas"
                          />
                        )}
                        {requirements.length > 1 && (
                          <button
                            type="button"
                            className="mt-2 text-xs font-semibold text-primary"
                            onClick={() => setRequirements((prev) => prev.filter((_, idx) => idx !== index))}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StepShell>
          )}

          <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
            <button
              type="button"
              className="btn-ghost w-full text-sm disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              disabled={step === 1}
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            >
              Back
            </button>
            <div className="grid gap-3 sm:flex sm:items-center">
              <button type="button" className="btn-secondary w-full text-sm sm:w-auto" onClick={runAiSuggest}>
                Improve with AI
              </button>
              {step < steps.length ? (
                <button type="button" className="btn-primary w-full text-sm sm:w-auto" onClick={() => setStep((prev) => prev + 1)}>
                  Continue
                </button>
              ) : (
                <button type="submit" className="btn-gradient w-full text-sm sm:w-auto" disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish gig'}
                </button>
              )}
            </div>
          </div>
          {submitStatus && <p className="rounded-[18px] bg-soft px-4 py-3 text-sm font-semibold text-primary">{submitStatus}</p>}
          {aiStatus && <p className="rounded-[18px] bg-bg-light px-4 py-3 text-sm text-muted">{aiStatus}</p>}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="overflow-hidden rounded-[24px] border border-border-color bg-card-bg shadow-soft">
            <div className="h-44 bg-bg-light sm:h-56">
              {previewImage ? (
                <img src={previewImage} alt="Gig preview" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center px-6 text-center text-sm font-semibold text-muted">
                  Add image URLs to preview your gig
                </div>
              )}
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">{form.category}</p>
                  <h3 className="mt-2 text-xl font-semibold leading-tight text-ink">
                    {form.title || 'Your gig title will appear here'}
                  </h3>
                </div>
                <span className="price-pill whitespace-nowrap">{money(form.basePrice)}</span>
              </div>
              <p className="text-sm leading-6 text-muted">
                {form.description || 'Add a clear description so buyers understand your service.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {tagList.length ? (
                  tagList.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="tag">Add tags</span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-border-color bg-card-bg p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">Gig readiness</p>
                <p className="mt-1 text-xs text-muted">
                  {doneCount} of {checklist.length} complete
                </p>
              </div>
              <span className="price-pill">{readiness}%</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-bg-light">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${readiness}%` }} />
            </div>
            <div className="mt-4 space-y-2">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-[16px] bg-bg-light px-3 py-2">
                  <span className="text-sm text-ink">{item.label}</span>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.done ? 'Done' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-border-color bg-bg-light p-5">
            <p className="text-sm font-semibold text-ink">Publishing rule</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Only verified Pakistani student sellers can publish. Draft fields still work so the gig can be prepared before approval.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
