const path = require('path');

/**
 * Helper to get absolute paths within the project
 */
module.exports = {
  /**
   * Get the absolute path to the Prisma client
   * @returns {string} Absolute path to the Prisma client
   */
  getPrismaClientPath: () => {
    return path.resolve(__dirname, '../../generated/prisma');
  },

  /**
   * Get the absolute path to the project root
   * @returns {string} Absolute path to the project root
   */
  getProjectRoot: () => {
    return path.resolve(__dirname, '../..');
  },
};