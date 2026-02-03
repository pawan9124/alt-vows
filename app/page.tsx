import { redirect } from 'next/navigation';

// Root page redirects to the first niche demo
// The actual niches are defined in data/niches.json
export default function HomePage() {
  redirect('/themes/rock-n-roll-wedding');
}