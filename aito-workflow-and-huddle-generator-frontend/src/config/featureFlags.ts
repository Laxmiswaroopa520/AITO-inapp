/**
 * Temporary demo visibility flags. Each one only hides an entry point; the features behind them
 * (pages, routes, dialogs, local API, approved content edits) stay in the code and keep working.
 * To bring a feature back, set its flag to true. Nothing else needs to change.
 */

/** Admin App: the "Admin" button on the home page and the /admin dashboard (redirects home while off). */
export const ADMIN_APP_ENABLED = false;

/** Manager role: the "Edit" button on the selected Huddle panel that opens the Suggest edits form. */
export const MANAGER_EDIT_ENABLED = false;
