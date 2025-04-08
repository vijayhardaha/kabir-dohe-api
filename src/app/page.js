import {
  DocsHeader,
  Introduction,
  ApiEndpoints,
  QueryParameters,
  ResponseFormat,
  ErrorResponse,
  UsageExamples,
  Examples,
  DocsSection,
  Contribution,
} from "@/components/docs";
import { API_QUERY_PARAMS } from "@/constants/api-params";

/**
 * Metadata for the Kabir Ke Dohe API documentation page.
 * Includes SEO-related information and social media previews.
 * @type {Object}
 */
export const metadata = {
  title: "Kabir Ke Dohe API",
  description:
    "Explore over 2500 timeless dohas (couplets) by Saint Kabir with this powerful and free API — ideal for spiritual seekers, developers, and Hindi literature enthusiasts.",
  keywords: ["kabir", "dohe", "couplets", "api", "hindi poetry", "spiritual"],
  openGraph: {
    title: "Kabir Ke Dohe API",
    description:
      "Explore over 2500 timeless dohas (couplets) by Saint Kabir with this powerful and free API — ideal for spiritual seekers, developers, and Hindi literature enthusiasts.",
    type: "website",
    url: "https://kabir-ke-dohe-api.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kabir Ke Dohe API",
    description:
      "Explore over 2500 timeless dohas (couplets) by Saint Kabir with this powerful and free API — ideal for spiritual seekers, developers, and Hindi literature enthusiasts.",
  },
};

/**
 * Home page component that renders the API documentation.
 * Displays various documentation sections including introduction,
 * endpoints, parameters, response formats, and usage examples.
 *
 * @returns {React.ReactElement} The rendered documentation page
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <DocsHeader />

      <DocsSection title="API Documentation">
        <Introduction />
        <ApiEndpoints />
        <QueryParameters parameters={API_QUERY_PARAMS} />
        <ResponseFormat />
        <ErrorResponse />
        <UsageExamples />
        <Examples />
        <Contribution />
      </DocsSection>
    </div>
  );
}
