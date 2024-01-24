/**
 * @openapi
 * '/posts/{postId}/comment':
 *  post:
 *     tags:
 *     - Comments
 *     parameters:
 *     - in: path
 *       required: true
 *       name: postId
 *       schema:
 *         type: string
 *       description: postId to comment on
 *     security:
 *     - bearerAuth: []
 *     summary: Create Comment on post
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - comment
 *            properties:
 *              comment:
 *                type: string
 *                default: Mention some one with '@'
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Invalid body
 *      401:
 *        description: Not Authorised
 *      500:
 *        description: Server Error
 */

/**
 * @openapi
 * '/comments/{commentId}':
 *  put:
 *     tags:
 *     - Comments
 *     parameters:
 *     - in: path
 *       required: true
 *       name: commentId
 *       schema:
 *         type: string
 *       description: commentId to react on
 *     security:
 *     - bearerAuth: []
 *     summary: React on comment
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - reaction
 *            properties:
 *              reaction:
 *                type: string
 *                enum:
 *                  - like
 *                  - unlike
 *                default: like
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Invalid body
 *      401:
 *        description: Not Authorised
 *      500:
 *        description: Server Error
 */
