# Kabir Dohe API

A free RESTful API providing access to over 2500 couplets (dohe) by Sant Kabir, one of India's most influential spiritual poets and philosophers.

## About

Kabir Dohe API lets you fetch, search, and filter Kabir's timeless couplets in JSON format. Each doha includes the original Hindi text, English transliteration, and detailed meanings. No authentication required.

## Ecosystem

| Project           | URL                                                              | Description                                          |
| ----------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| Kabir Dohe Hub    | [kabirdohehub.vercel.app](https://kabirdohehub.vercel.app)       | Collection of Kabir ke dohe for reading and learning |
| Kabir Dohe API    | [kabirdoheapi.vercel.app](https://kabirdoheapi.vercel.app)       | REST API for accessing couplets programmatically     |
| Kabir Dohe Images | [kabirdoheimages.vercel.app](https://kabirdoheimages.vercel.app) | Visual quotes and image generation                   |

## Features

- Access 2500+ couplets with Hindi text, translations, and interpretations
- Search by keyword across couplet content
- Filter by tags, categories, and popularity
- Sort and paginate results
- Completely free to use, no authentication needed

## Quick Start

```
GET https://kabirdoheapi.vercel.app/api/couplets
```

```
GET https://kabirdoheapi.vercel.app/api/couplets?search_query=truth&per_page=5
```

Full documentation with all parameters, examples, and response formats is available at **[kabirdoheapi.vercel.app](https://kabirdoheapi.vercel.app)**.

## Contributing

We welcome contributions from everyone. Whether you are a developer or not, you can help improve the couplet data, translations, and documentation.

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## License

MIT License. See [LICENSE](LICENSE) for details.
