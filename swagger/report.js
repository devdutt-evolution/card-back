/**
 * @openapi
 * '/reports/{postId}':
 *  post:
 *     tags:
 *     - Report
 *     parameters:
 *     - in: path
 *       required: true
 *       name: postId
 *       schema:
 *         type: string
 *       description: postId of post to report
 *     security:
 *     - bearerAuth: []
 *     summary: report post
 *     requestBody:
 *      required: false
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              reason:
 *                type: string
 *                default: reason to report
 *     responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Post not found
 *      500:
 *        description: Server Error
 */

/**
 * @openapi
 * '/reports':
 *  get:
 *     tags:
 *     - Report
 *     security:
 *     - bearerAuth: []
 *     summary: get reported posts
 *     responses:
 *      200:
 *        description: Success
 *      403:
 *        description: Not authorized
 *      404:
 *        description: Post not found
 *      500:
 *        description: Server Error
 */

/**
 * @openapi
 * '/reports/{postId}':
 *  delete:
 *     tags:
 *     - Report
 *     parameters:
 *     - in: path
 *       required: true
 *       name: postId
 *       schema:
 *         type: string
 *       description: postId of post to delete
 *     security:
 *     - bearerAuth: []
 *     summary: delete post from feed
 *     responses:
 *      200:
 *        description: Success
 *      403:
 *        description: Not authorized
 *      404:
 *        description: Post not found
 *      500:
 *        description: Server Error
 */

/**
 * @openapi
 * '/reports/{postId}':
 *  put:
 *     tags:
 *     - Report
 *     parameters:
 *     - in: path
 *       required: true
 *       name: postId
 *       schema:
 *         type: string
 *       description: postId of post to discard its reports
 *     security:
 *     - bearerAuth: []
 *     summary: discard all reports
 *     responses:
 *      200:
 *        description: Success
 *      403:
 *        description: Not authorized
 *      404:
 *        description: Post not found
 *      500:
 *        description: Server Error
 */
