/**
 * Helper functions for implementing pagination
 */

/**
 * Generate pagination parameters from request query
 * @param {Object} query - Request query object
 * @param {number} defaultLimit - Default items per page
 * @returns {Object} - Pagination parameters
 */
const getPaginationParams = (query, defaultLimit = 10) => {
    // Get page and limit from query, with defaults
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || defaultLimit;
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    return {
      skip,
      take: limit,
      page,
      limit
    };
  };
  
  /**
   * Generate pagination metadata for response
   * @param {number} count - Total count of items
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @returns {Object} - Pagination metadata
   */
  const getPaginationMetadata = (count, page, limit) => {
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    return {
      currentPage: page,
      totalPages,
      totalItems: count,
      itemsPerPage: limit,
      hasNextPage,
      hasPreviousPage
    };
  };
  
  module.exports = {
    getPaginationParams,
    getPaginationMetadata
  };