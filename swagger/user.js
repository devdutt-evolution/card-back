/**
 * @openapi
 * components:
 *  securitySchemes:
 *    bearerAuth:            # arbitrary name for the security scheme
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT    # optional, arbitrary value for documentation purposes
 */

/**
 * @openapi
 * '/users':
 *  get:
 *     tags:
 *     - Users
 *     parameters:
 *     - in: query
 *       name: _q
 *       schema:
 *         type: string
 *       description: username or display name to search users
 *     security:
 *     - bearerAuth: []
 *     summary: Users list
 *     responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Users Not Found
 *      500:
 *        description: Server Error
 */

/**
 * @openapi
 * '/user/{userId}':
 *  get:
 *     tags:
 *     - Users
 *     parameters:
 *     - in: path
 *       required: true
 *       name: userId
 *       schema:
 *         type: string
 *       description: userId of user to find
 *     security:
 *     - bearerAuth: []
 *     summary: User Details
 *     responses:
 *      200:
 *        description: Success
 *      404:
 *        description: User Not Found
 *      500:
 *        description: Server Error
 */
