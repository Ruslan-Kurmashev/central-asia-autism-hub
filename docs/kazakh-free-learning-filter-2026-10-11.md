# Kazakh language filtering and new free courses (11 October 2026)

Three new free Kazakh-language training courses were selected from the individual official provider pages:
- Daryn Ustaz: inclusive education, 80 hours, 20 lessons; https://daryn.ai/courses/Inklyuziya
- MOOC «Өрлеу»: AI for parents, 6 hours, 6 lessons; https://mooc.orleu.edu.kz/courses/course/4/
- Daryn Ustaz: AI in educational practice, 80 hours, 24 lessons; https://daryn.ai/courses/bilim-berudegi-zasandy-intellekt-innovaciialyq-texnologiialar-men-oqu-uderisinin-cifrlyq-transformaciiasy

All three official individual course pages show Kazakh teaching language; Daryn pages explicitly say Тегін and Сертификат беріледі. Orleu's general terms at https://mooc.orleu.edu.kz/about/ explicitly say participation and completion certificates are free. Published descriptions state access routes and reported completion awards without inventing account-only test thresholds, Kazakhstan diploma equivalency or guaranteed individual enrolment. The AI courses are general digital literacy / education, not autism-specific specialist courses.

The original-language dropdown uses a deterministic RU, KK, EN ordering (only languages represented in the catalogue appear). Free-text search also indexes the localized language label, so searches for `Казахский`, `Қазақша` or `Kazakh` find Kazakh-language offerings. There is no additional shortcut button because it duplicates the language dropdown.

Regression test: `npm run check:learning-language-filter` is included in `npm run validate` and inspects the built RU/KK/EN catalogue HTML for the Kazakh dropdown option, absence of a redundant shortcut, and five published Kazakh-language course links. This is a structural check; manual interaction testing is separate.

## UX update (11 October 2026)

Removed the redundant «Курсы на казахском» / «Қазақ тіліндегі курстар» / «Courses in Kazakh» button from all three catalogue languages. The existing «Язык курса» / «Курс тілі» / «Course language» dropdown continues to provide the Kazakh option, and free-text search still indexes language names.

## Combined, contextual course filtering (12 October 2026)

The earlier single-category behaviour is superseded. Audience, original teaching language, topic and free-text search now work as **combined AND filters**. Changing one criterion must never clear another. Each `All` option resets only its own filter; clearing search resets only its query. A valid combination with zero matching courses displays the empty-state message without altering selections.

Counts shown in every dropdown are **contextual facet counts**: the count for an option is calculated using the current values of all other dropdowns and the search query, but without applying the dropdown's current value. Thus a user can see how many courses would match each next choice. A separate result count shows the actual current intersection.

The user-requested tests include parents + Kazakh + inclusion and professionals + English + autism, and the same combinations combined with keyword search. Test execution through `npm run check:learning-filter-interactions` runs the actual catalogue event handlers against the RU, KK and EN generated card data, including empty states, restored browser state and dynamic option counts.
