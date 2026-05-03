/**
 * Compute the completion percentage for a project.
 * @param {number} total - Total number of tasks (non-negative integer)
 * @param {number} completed - Number of completed tasks (non-negative integer, <= total)
 * @returns {number} Integer 0–100 representing the completion percentage
 */
export function computeCompletionPercentage(total, completed) {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}
