/**
 * @openapi
 * '/posts':
 *  get:
 *     tags:
 *     - Posts
 *     parameters:
 *     - in: query
 *       name: _q
 *       schema:
 *         type: string
 *       description: query posts with title
 *     - in: query
 *       name: _page
 *       schema:
 *         type: number
 *         default: 1
 *       description: _page in pagination
 *     - in: query
 *       name: _sort
 *       schema:
 *         type: string
 *         enum:
 *           - title
 *           - description
 *           - numberOfLikes
 *           - createdAt
 *         default: title
 *       description: sort with field
 *     - in: query
 *       name: _order
 *       schema:
 *         type: string
 *         enum:
 *           - asc
 *           - desc
 *         default: asc
 *       description: order asc or desc
 *     - in: query
 *       name: _limit
 *       schema:
 *         type: number
 *         default: 10
 *       description: per page limit
 *     - in: query
 *       name: _expand
 *       schema:
 *         type: string
 *         enum:
 *           - user
 *         default: user
 *       description: query posts with title
 *     security:
 *     - bearerAuth: []
 *     summary: Posts list
 *     responses:
 *      200:
 *        description: Success
 *      500:
 *        description: Server Error
 */

/**
 * @openapi
 * '/posts/{postId}':
 *  get:
 *     tags:
 *     - Posts
 *     parameters:
 *     - in: path
 *       required: true
 *       name: postId
 *       schema:
 *         type: string
 *       description: postId of post
 *     security:
 *     - bearerAuth: []
 *     summary: get post details
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
 * '/posts/{postId}/report':
 *  post:
 *     tags:
 *     - Posts
 *     parameters:
 *     - in: path
 *       required: true
 *       name: postId
 *       schema:
 *         type: string
 *       description: postId of post
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
 * '/posts':
 *  post:
 *     tags:
 *     - Posts
 *     security:
 *     - bearerAuth: []
 *     summary: Create Post
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - title
 *              - body
 *            properties:
 *              title:
 *                type: string
 *                default: title of the post
 *              body:
 *                type: string
 *                default: Body of the post \n Mention some one with '@'
 *              tobePublished:
 *                type: boolean
 *                default: false
 *              publishAt:
 *                type: number
 *                default: 1706081885691
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Invalid body
 *      401:
 *        description: Not Authorized
 *      500:
 *        description: Server Error
 */

/**
 * @openapi
 * '/posts/{postId}':
 *  put:
 *     tags:
 *     - Posts
 *     parameters:
 *     - in: path
 *       required: true
 *       name: postId
 *     security:
 *     - bearerAuth: []
 *     summary: Update Post
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - title
 *              - body
 *            properties:
 *              title:
 *                type: string
 *                default: title of the post
 *              body:
 *                type: string
 *                default: Body of the post \n Mention some one with '@'
 *     responses:
 *      200:
 *        description: Updated
 *      400:
 *        description: Invalid body
 *      401:
 *        description: Not Authorized
 *      500:
 *        description: Server Error
 */

/**
 * @openapi
 * '/posts/{postId}/react':
 *  put:
 *     tags:
 *     - Posts
 *     parameters:
 *     - in: path
 *       required: true
 *       name: postId
 *       schema:
 *         type: string
 *       description: postId to react on
 *     security:
 *     - bearerAuth: []
 *     summary: React on post
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
 *      200:
 *        description: Success
 *      500:
 *        description: Server Error
 */
