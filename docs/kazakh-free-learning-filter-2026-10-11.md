# Kazakh language filtering and new free courses (11 October 2026)

Three new free Kazakh-language training courses were selected from the individual official provider pages:
- Daryn Ustaz: inclusive education, 80 hours, 20 lessons; https://daryn.ai/courses/Inklyuziya
- MOOC «Өрлеу»: AI for parents, 6 hours, 6 lessons; https://mooc.orleu.edu.kz/courses/course/4/
- Daryn Ustaz: AI in educational practice, 80 hours, 24 lessons; https://daryn.ai/courses/bilim-berudegi-zasandy-intellekt-innovaciialyq-texnologiialar-men-oqu-uderisinin-cifrlyq-transformaciiasy

All three official individual course pages show Kazakh teaching language; Daryn pages explicitly say Тегін and Сертификат беріледі. Orleu's general terms at https://mooc.orleu.edu.kz/about/ explicitly say participation and completion certificates are free. Published descriptions state access routes and reported completion awards without inventing account-only test thresholds, Kazakhstan diploma equivalency or guaranteed individual enrolment. The AI courses are general digital literacy / education, not autism-specific specialist courses.

The original-language dropdown uses a deterministic RU, KK, EN ordering (only languages represented in the catalogue appear). A visible **Kazakh-language shortcut** synchronises with that dropdown on every locale. Free-text search also indexes the localized language label, so searches for `Казахский`, `Қазақша` or `Kazakh` find Kazakh-language offerings. The quick selector is only offered when a Kazakh-language course exists.

Regression test: `npm run check:learning-language-filter` is included in `npm run validate` and inspects the built RU/KK/EN catalogue HTML for the Kazakh option, shortcut and five published Kazakh-language course IDs. This is a structural check; manual interaction testing is separate.
