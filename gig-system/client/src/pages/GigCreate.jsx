import { useMemo, useState } from 'react';
import { aiSuggest, createGig } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

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

const demoFreelancer = {
  name: 'Manal Khan',
  title: 'Creative freelancer and WordPress expert',
  location: 'Lahore, Pakistan',
  avatarUrl: '',
  portfolio: ['https://example.com/portfolio-1', 'https://example.com/portfolio-2'],
};

const emptyService = () => ({
  title: '',
  price: 0,
  durationHours: 2,
  included: [''],
});

export default function GigCreate() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    tags: '',
    basePrice: 15000,
    deliveryDays: 3,
    quickTask: false,
    quickDeliveryHours: 2,
    images: '',
    videoUrl: '',
    featured: true,
  });
  const [services, setServices] = useState([emptyService()]);
  const [aiStatus, setAiStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const tagList = useMemo(
    () =>
      form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tags],
  );

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

  const runAiSuggest = async () => {
    setAiStatus('Generating AI suggestions...');
    const response = await aiSuggest({
      title: form.title,
      description: form.description,
      category: form.category,
      budget: form.basePrice,
    });
    setForm((prev) => ({
      ...prev,
      basePrice: response.price,
      description: response.description,
      tags: response.tags.join(', '),
      deliveryDays: response.deliveryDays,
    }));
    setAiStatus('AI suggestions applied.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setAiStatus('Please login to publish a gig.');
      return;
    }
    if (!form.videoUrl) {
      setAiStatus('Video intro is required.');
      return;
    }
    setSubmitting(true);
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      tags: tagList,
      basePrice: Number(form.basePrice),
      deliveryDays: Number(form.deliveryDays),
      quickTask: form.quickTask,
      quickDeliveryHours: Number(form.quickDeliveryHours),
      images: form.images.split(',').map((item) => item.trim()).filter(Boolean),
      videoUrl: form.videoUrl,
      featured: form.featured,
      services: services.map((item) => ({
        ...item,
        price: Number(item.price),
        durationHours: Number(item.durationHours),
        included: item.included.filter(Boolean),
      })),
      freelancer: demoFreelancer,
    };
    await createGig(payload);
    setSubmitting(false);
    setAiStatus('Gig published successfully.');
    setForm((prev) => ({ ...prev, title: '', description: '' }));
  };

  return (
    <div className="space-y-10">
      {/* AI suggestion header */}
      <section className="card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Gig creation</p>
            <h1 className="font-display text-3xl font-semibold">Create an AI-powered gig</h1>
            <p className="text-muted">
              Use the AI suggestions button to auto-generate pricing, tags, and descriptions based on your input.
            </p>
          </div>
          <button className="btn-gradient" type="button" onClick={runAiSuggest}>
            AI Suggest
          </button>
        </div>
        {aiStatus && <p className="mt-4 text-sm text-primary">{aiStatus}</p>}
      </section>

      {/* Gig creation form + live preview */}
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-6">
          {/* Core gig details */}
          <section className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Gig essentials</h2>
            <input
              className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3"
              placeholder="Gig title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
            <textarea
              className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3"
              rows="5"
              placeholder="Describe your gig"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <select
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
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
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(event) => setForm({ ...form, tags: event.target.value })}
              />
            </div>
          </section>

          {/* Pricing and delivery */}
          <section className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Pricing + delivery</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="number"
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                placeholder="Base price"
                value={form.basePrice}
                onChange={(event) => setForm({ ...form, basePrice: event.target.value })}
              />
              <input
                type="number"
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                placeholder="Delivery days"
                value={form.deliveryDays}
                onChange={(event) => setForm({ ...form, deliveryDays: event.target.value })}
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold text-muted">
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
                className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                placeholder="Quick delivery hours"
                value={form.quickDeliveryHours}
                onChange={(event) => setForm({ ...form, quickDeliveryHours: event.target.value })}
              />
            )}
          </section>

          {/* Custom package builder */}
          <section className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Custom package builder</h2>
              <button className="btn-ghost text-sm" type="button" onClick={addService}>
                Add service
              </button>
            </div>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={`service-${index}`} className="rounded-2xl border border-[#E5E7EB] bg-base p-4">
                  <div className="flex items-center justify-between">
                    <input
                      className="w-full rounded-full border border-[#E5E7EB] px-3 py-2 text-sm"
                      placeholder="Service title (logo, social kit, etc.)"
                      value={service.title}
                      onChange={(event) => handleServiceChange(index, 'title', event.target.value)}
                    />
                    {services.length > 1 && (
                      <button
                        type="button"
                        className="ml-3 text-xs font-semibold text-primary"
                        onClick={() => removeService(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <input
                      type="number"
                      className="rounded-full border border-[#E5E7EB] px-3 py-2 text-sm"
                      placeholder="Price"
                      value={service.price}
                      onChange={(event) => handleServiceChange(index, 'price', event.target.value)}
                    />
                    <input
                      type="number"
                      className="rounded-full border border-[#E5E7EB] px-3 py-2 text-sm"
                      placeholder="Duration (hours)"
                      value={service.durationHours}
                      onChange={(event) => handleServiceChange(index, 'durationHours', event.target.value)}
                    />
                  </div>
                  <div className="mt-3 space-y-2">
                    {service.included.map((feature, fIdx) => (
                      <input
                        key={`feature-${index}-${fIdx}`}
                        className="w-full rounded-full border border-[#E5E7EB] px-3 py-2 text-sm"
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

          {/* Media inputs */}
          <section className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Media</h2>
            <input
              className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3"
              placeholder="Image URLs (comma separated)"
              value={form.images}
              onChange={(event) => setForm({ ...form, images: event.target.value })}
            />
            <input
              className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3"
              placeholder="Video intro URL (required)"
              value={form.videoUrl}
              onChange={(event) => setForm({ ...form, videoUrl: event.target.value })}
              required
            />
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <p className="text-sm font-semibold text-muted">Preview</p>
            <div className="mt-4 aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black">
              {form.videoUrl ? (
                <video className="h-full w-full object-cover" controls>
                  <source src={form.videoUrl} />
                </video>
              ) : (
                <div className="grid h-full place-items-center text-sm text-white/80">
                  TikTok-style video preview
                </div>
              )}
            </div>
          </div>

          <div className="card p-6 space-y-3">
            <p className="text-sm font-semibold text-muted">Freelancer profile</p>
            <h3 className="text-lg font-bold">{demoFreelancer.name}</h3>
            <p className="text-sm text-muted">{demoFreelancer.title}</p>
            <p className="text-sm text-muted">{demoFreelancer.location}</p>
            <p className="text-xs text-muted">Portfolio</p>
            <ul className="text-xs text-primary">
              {demoFreelancer.portfolio.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <button className="btn-gradient w-full" type="submit" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish gig'}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
