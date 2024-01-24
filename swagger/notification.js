/**
 * @openapi
 * '/notifications':
 *  get:
 *     tags:
 *     - Notifications
 *     parameters:
 *     - in: query
 *       name: _page
 *       schema:
 *         type: number
 *       description: for pagination
 *     - in: query
 *       name: _limit
 *       schema:
 *         type: number
 *       description: for pagination
 *     security:
 *     - bearerAuth: []
 *     summary: Notifications list
 *     responses:
 *      200:
 *        description: Success
 *      500:
 *        description: Server Error
 */

/**
 * @openapi
 * '/notifications':
 *  put:
 *     tags:
 *     - Notifications
 *     security:
 *     - bearerAuth: []
 *     summary: Mark all notifications as read/seen
 *     responses:
 *      200:
 *        description: Success
 *      500:
 *        description: Server Error
 */
