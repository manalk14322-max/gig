import express from 'express';

const router = express.Router();

const categories = [
  { label: 'Graphics & Design', icon: '🎨' },
  { label: 'Programming & Tech', icon: '💻' },
  { label: 'Digital Marketing', icon: '📈' },
  { label: 'Writing & Translation', icon: '📝' },
  { label: 'Video & Animation', icon: '🎬' },
  { label: 'Music & Audio', icon: '🎧' },
  { label: 'Business', icon: '🏢' },
  { label: 'AI Services', icon: '🤖' },
];

router.get('/', (_req, res) => {
  res.json({
    brand: {
      name: 'UniHire',
      email: 'manalk14322@gmail.com',
      socials: ['Instagram', 'LinkedIn', 'Facebook'],
    },
    categories,
    trust: ['Verified students', 'Campus-first profiles', 'Secure local payments'],
  });
});

export default router;
