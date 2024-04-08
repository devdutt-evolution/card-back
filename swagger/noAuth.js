/**
 * @openapi
 * '/signin':
 *  post:
 *     tags:
 *     - User Auth
 *     summary: Login
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *              - fcmToken
 *            properties:
 *              email:
 *                type: string
 *                default: devdutt@mail.com
 *              password:
 *                type: string
 *                default: password
 *              fcmToken:
 *                type: string
 *                default: anything
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Invalid body
 *      401:
 *        description: Not Authorised
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */

/**
 * @openapi
 * '/register':
 *  post:
 *     tags:
 *     - User Auth
 *     summary: Register
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                default: devd
 *              email:
 *                type: string
 *                default: devdutt@mail.com
 *              password:
 *                type: string
 *                default: password
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Invalid body
 *      401:
 *        description: Not Authorised
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
