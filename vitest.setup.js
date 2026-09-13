// Pins the "local" timezone to UTC for the test process only.
// Some utility functions (previewShortTime, previewLongDate, etc.)
// deliberately use Intl.DateTimeFormat WITHOUT an explicit timeZone option,
// since that's how Discord itself renders timestamps,
// relative to each viewer's own local system time.
//
// Without pinning this, tests asserting exact preview text would pass or fail differently
// depending on which timezone the machine running them happens to be in.
// This has no effect on the actual deployed app, it only applies within this test process.
process.env.TZ = 'UTC';