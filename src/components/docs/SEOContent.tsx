/**
 * Component that displays SEO-friendly content for API endpoints.
 *
 * @returns {React.JSX.Element} - The rendered SEO content section.
 */
export function SEOContent(): React.JSX.Element {
  return (
    <>
      <section>
        <h2 className="mb-6 text-2xl font-bold">Unlock the Wisdom of Kabir with Our Dohe API</h2>
        <p className="mb-6 text-lg">
          <strong>Kabir ke Dohe API</strong> is a powerful RESTful service that offers structured access to the timeless
          dohas (couplets) of Sant Kabir. It delivers original verses with Hindi meanings and English translations,
          enabling developers, educators, and creators to integrate spiritual wisdom into modern platforms effortlessly.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl">Why Use This API?</h2>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>Structured dohas in JSON with translations</li>
          <li>Fast and reliable serverless deployment (Vercel)</li>
          <li>Free and open for personal or commercial use</li>
          <li>Easy to integrate with any tech stack</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl">When to Use It?</h2>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>Educational platforms and LMS tools</li>
          <li>Daily spiritual quote apps or widgets</li>
          <li>AI chatbots and virtual assistants</li>
          <li>Blog or social media content automation</li>
          <li>Web/mobile apps for Indian philosophy</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl">Who Can Use This API?</h2>
        <ul className="list-inside list-disc space-y-2 pl-4">
          <li>Frontend & backend developers</li>
          <li>Educators and e-learning providers</li>
          <li>Influencers and content creators</li>
          <li>Philosophy researchers and students</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl">Who Was Kabir?</h2>
        <p className="mb-6">
          <strong>Sant Kabir Das (1440–1518)</strong> was a spiritual poet and reformer of medieval India, known for his
          deeply philosophical couplets. His teachings, grounded in unity, truth, and inner awakening, still resonate
          across generations. Kabir’s poetry transcends religion, emphasizing humanity over ritual.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl">What Can You Build Using This API?</h2>
        <ul className="mb-10 list-inside list-disc space-y-2 pl-4">
          <li>Quote generators and browser widgets</li>
          <li>Voice assistants or chatbots with spiritual replies</li>
          <li>Android/iOS apps delivering daily dohas</li>
          <li>NLP or ML tools trained on vernacular texts</li>
          <li>Social media bots or automation tools</li>
        </ul>
      </section>

      <section>
        <div className="text-center">
          <p className="text-xl font-medium">Ready to build with ancient wisdom?</p>
          <a href="https://kabir-ke-dohe-api.vercel.app/" className="btn-primary btn mt-4 px-6 py-3 text-lg">
            Explore the API Docs
          </a>
        </div>
      </section>
    </>
  );
}
